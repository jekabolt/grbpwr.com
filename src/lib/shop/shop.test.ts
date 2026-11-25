// node --test (Node ≥ 22.18 strips TS types natively). Proves the X18 isolation
// rules: two shop hosts → two brands, two cache keys, two tag namespaces.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GRBPWR_ANALYTICS,
  GRBPWR_PACK,
  grbpwrMarkdownPaths,
} from "../../brands/grbpwr/config.ts";
import { resolvePack } from "../../brands/index.ts";
import {
  sessionCookieClears,
  sessionCookieWrites,
  sessionTokensFrom,
} from "../storefront-account/session-tokens.ts";
import { shopIdentityMarkdown, shopMarkdown } from "./content.ts";
import {
  normalizeShopHost,
  resolveShopHost,
  SHOP_HOST_HEADER,
  shopBackendUrl,
  shopCacheTag,
} from "./host.ts";
import { HSTS_HOST_ONLY, HSTS_WITH_SUBDOMAINS, hstsFor } from "./hsts.ts";
import {
  fetchShopProfile,
  parseShopProfile,
  shopThemeCss,
  toShopBrand,
  type ShopProfileResult,
} from "./profile.ts";
import {
  deriveShopRevalidateSecret,
  revalidateSecretAccepted,
  safeEqual,
} from "./revalidate-secret.ts";
import {
  isPackRootFileName,
  isRootRouteHandler,
  packPublicFileAllowed,
  packRootFile,
  primaryHostRedirect,
  shopPagePath,
  staticHostRedirect,
} from "./routing.ts";
import { stripeLoadArgs } from "./stripe.ts";

const BACKEND = "https://api.beta.lekalo.studio/";
const A = "acme.shop.lekalo.studio";
const B = "zeta.shop.lekalo.studio";

type Call = { url: string; host: string | undefined; tags: string[] };

/** Fake backend: answers by the x-shop-host header, records every call. */
function fakeBackend(calls: Call[]) {
  const profiles: Record<string, unknown> = {
    [A]: {
      shopKey: "k-acme",
      name: "Acme",
      primaryHost: A,
      logoUrl: "https://cdn.example.com/acme.png",
      colors: { accent: "#ff0000", background: "#000000" },
      open: true,
    },
    [B]: {
      shopKey: "k-zeta",
      name: "Zeta",
      primaryHost: B,
      logoUrl: "http://insecure.example.com/zeta.png",
      colors: { accent: "red;}body{display:none" },
      open: true,
    },
    "closed.shop.lekalo.studio": { shopKey: "k-c", name: "C", open: false },
  };
  return async (
    url: string,
    init: RequestInit & { next?: { tags?: string[] } },
  ) => {
    const host = (init.headers as Record<string, string>)[SHOP_HOST_HEADER];
    calls.push({ url, host, tags: init.next?.tags ?? [] });
    if (host === "down.shop.lekalo.studio") throw new Error("ECONNREFUSED");
    if (host === "off.shop.lekalo.studio") {
      return resp(404, { message: "shop_closed" });
    }
    const profile = host ? profiles[host] : undefined;
    return profile
      ? resp(200, { profile })
      : resp(404, { message: "not found" });
  };
}

function resp(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

function okProfile(r: ShopProfileResult) {
  assert.equal(r.status, "ok");
  return (r as Extract<ShopProfileResult, { status: "ok" }>).profile;
}

describe("two hosts → two brands, separate cache keys and tags", () => {
  it("fetches each shop's own brand with its own header, URL and tag", async () => {
    const calls: Call[] = [];
    const fetchImpl = fakeBackend(calls);
    const a = okProfile(
      await fetchShopProfile(A, { backendUrl: BACKEND, fetchImpl }),
    );
    const b = okProfile(
      await fetchShopProfile(B, { backendUrl: BACKEND, fetchImpl }),
    );

    assert.equal(toShopBrand(a).name, "Acme");
    assert.equal(toShopBrand(b).name, "Zeta");

    assert.deepEqual(
      calls.map((c) => c.host),
      [A, B],
    );
    assert.equal(
      calls[0]!.url,
      `https://api.beta.lekalo.studio/api/frontend/shop/profile?shop=${A}`,
    );
    assert.notEqual(calls[0]!.url, calls[1]!.url);
    assert.deepEqual(calls[0]!.tags, [`shop:${A}:profile`]);
    assert.deepEqual(calls[1]!.tags, [`shop:${B}:profile`]);
  });

  it("namespaces every data tag and cache key by host", () => {
    assert.equal(shopCacheTag(A, "products"), `shop:${A}:products`);
    assert.notEqual(shopCacheTag(A, "products"), shopCacheTag(B, "products"));
    assert.equal(
      shopBackendUrl(BACKEND, "/api/frontend/hero?x=1", A),
      `https://api.beta.lekalo.studio/api/frontend/hero?x=1&shop=${A}`,
    );
    assert.notEqual(
      shopBackendUrl(BACKEND, "api/frontend/hero", A),
      shopBackendUrl(BACKEND, "api/frontend/hero", B),
    );
  });

  it("drops unsafe brand fields (http logo, CSS injection in colours)", async () => {
    const b = okProfile(
      await fetchShopProfile(B, {
        backendUrl: BACKEND,
        fetchImpl: fakeBackend([]),
      }),
    );
    assert.equal(b.logoUrl, undefined);
    assert.equal(b.colors?.accent, undefined);
    assert.equal(shopThemeCss(b.colors), "");
    const a = okProfile(
      await fetchShopProfile(A, {
        backendUrl: BACKEND,
        fetchImpl: fakeBackend([]),
      }),
    );
    assert.equal(
      shopThemeCss(a.colors),
      ":root{--highlight:#ff0000;--text-select:#ff0000}:root:not(.blackTheme){--background:#000000}",
    );
  });
});

describe("fail closed", () => {
  const opts = { backendUrl: BACKEND, fetchImpl: fakeBackend([]) };
  it("no host → unknown, no backend call", async () => {
    const calls: Call[] = [];
    const r = await fetchShopProfile(null, {
      backendUrl: BACKEND,
      fetchImpl: fakeBackend(calls),
    });
    assert.equal(r.status, "unknown");
    assert.equal(calls.length, 0);
  });
  it("unknown host → unknown", async () => {
    assert.equal(
      (await fetchShopProfile("nope.shop.lekalo.studio", opts)).status,
      "unknown",
    );
  });
  it("shop_closed 404 and open:false → closed", async () => {
    assert.equal(
      (await fetchShopProfile("off.shop.lekalo.studio", opts)).status,
      "closed",
    );
    assert.equal(
      (await fetchShopProfile("closed.shop.lekalo.studio", opts)).status,
      "closed",
    );
  });
  it("network failure → error (not cached as unknown)", async () => {
    assert.equal(
      (await fetchShopProfile("down.shop.lekalo.studio", opts)).status,
      "error",
    );
  });
});

describe("host normalisation", () => {
  it("canonicalises the request host", () => {
    // www. is a host of its own (kept; the middleware 308s it when told to).
    assert.equal(
      normalizeShopHost("WWW.Acme.Shop.Lekalo.Studio:443"),
      `www.${A}`,
    );
    assert.equal(normalizeShopHost("Acme.Shop.Lekalo.Studio:443"), A);
    assert.equal(normalizeShopHost(`${A}., evil.com`), A);
    assert.equal(normalizeShopHost("[::1]:3000"), null);
    assert.equal(normalizeShopHost("a b.com"), null);
    assert.equal(normalizeShopHost(""), null);
  });
  it("dev override only on localhost / vercel previews", () => {
    assert.equal(resolveShopHost("localhost:3000", A), A);
    assert.equal(resolveShopHost("lekalo-shop-git-x.vercel.app", A), A);
    assert.equal(resolveShopHost("localhost:3000", undefined), null);
    assert.equal(resolveShopHost(B, A), B);
  });
});

describe("per-shop revalidation secret", () => {
  it("differs per shop and is stable", async () => {
    const a1 = await deriveShopRevalidateSecret("master", "k-acme");
    const a2 = await deriveShopRevalidateSecret("master", "k-acme");
    const b = await deriveShopRevalidateSecret("master", "k-zeta");
    assert.equal(a1.length, 64);
    assert.ok(safeEqual(a1, a2));
    assert.ok(!safeEqual(a1, b));
  });
});

describe("per-shop content", () => {
  it("uses the shop's own markdown, else its legal identity", () => {
    const legal = { faq: "# faq", "faq.de": "# fragen" };
    assert.equal(shopMarkdown(legal, "faq", "de"), "# fragen");
    assert.equal(shopMarkdown(legal, "faq", "fr"), "# faq");
    assert.equal(shopMarkdown(undefined, "faq", "en"), undefined);
    assert.equal(
      shopIdentityMarkdown({ legalName: "Acme Ltd", email: "hi@acme.test" }),
      "## Acme Ltd\n\nhi@acme.test",
    );
  });
});

describe("grbpwr pack", () => {
  it("profile field decides; host only while the field is absent", () => {
    assert.equal(resolvePack(undefined, "grbpwr.com"), GRBPWR_PACK);
    assert.equal(resolvePack(undefined, "www.grbpwr.com"), GRBPWR_PACK);
    assert.equal(resolvePack(undefined, A), undefined);
    assert.equal(resolvePack("grbpwr", A), GRBPWR_PACK);
    assert.equal(resolvePack("", "grbpwr.com"), undefined);
    assert.equal(resolvePack("other", "grbpwr.com"), undefined);
  });
  it("keeps grbpwr's analytics ids in the pack", () => {
    assert.equal(GRBPWR_ANALYTICS.gtmId, "GTM-WFC98J99");
    assert.equal(GRBPWR_ANALYTICS.ga4Id, "G-YX09JT9HVC");
  });
  it("markdown candidates: locale, then the default", () => {
    assert.deepEqual(grbpwrMarkdownPaths("faq", "de"), [
      "/brands/grbpwr/content/faq/faq.de.md",
      "/brands/grbpwr/content/faq/faq.md",
    ]);
    assert.deepEqual(grbpwrMarkdownPaths("privacy-policy", "fr"), [
      "/brands/grbpwr/content/legal/privacy-policy/fr.md",
      "/brands/grbpwr/content/legal/privacy-policy/en.md",
    ]);
    assert.deepEqual(grbpwrMarkdownPaths("tier-plus", "ja"), [
      "/brands/grbpwr/content/tier/plus/ja.md",
      "/brands/grbpwr/content/tier/plus/en.md",
    ]);
  });
});

describe("routing", () => {
  it("pins the page path to the host", () => {
    assert.equal(shopPagePath(A, "en", "/p/x"), `/${A}/en/p/x`);
    assert.equal(shopPagePath(A, "de", ""), `/${A}/de`);
  });
  it("308s to the primary host only when it is real, different and listed", () => {
    const p = { primaryHost: A, hosts: [A, `www.${A}`] };
    assert.equal(primaryHostRedirect(`www.${A}`, p), A);
    // Fails closed: no list, an empty list, or junk never makes a target.
    assert.equal(primaryHostRedirect(`www.${A}`, { primaryHost: A }), null);
    assert.equal(
      primaryHostRedirect(`www.${A}`, { primaryHost: A, hosts: [] }),
      null,
    );
    assert.equal(
      primaryHostRedirect(`www.${A}`, {
        primaryHost: "evil.example",
        hosts: ["https://evil.example/x", "evil.example:443/"],
      }),
      null,
    );
    assert.equal(
      primaryHostRedirect(`www.${A}`, {
        primaryHost: "evil.example/phish",
        hosts: ["evil.example/phish"],
      }),
      null,
    );
    assert.equal(
      primaryHostRedirect(`www.${A}`, { primaryHost: 42, hosts: "x" }),
      null,
    );
    // Normalized on both sides before comparing.
    assert.equal(
      primaryHostRedirect(`www.${A}`, {
        primaryHost: ` ${A.toUpperCase()}. `,
        hosts: [`${A}:443`],
      }),
      A,
    );
    assert.equal(primaryHostRedirect(A, p), null);
    assert.equal(primaryHostRedirect("localhost", p), null);
    assert.equal(
      primaryHostRedirect(`www.${A}`, { primaryHost: B, hosts: [A] }),
      null,
    );
    assert.equal(
      primaryHostRedirect(`www.${A}`, { primaryHost: "x.vercel.app" }),
      null,
    );
    assert.equal(primaryHostRedirect(`www.${A}`, null), null);
    // grbpwr.com answers as itself whatever a profile says.
    assert.equal(primaryHostRedirect("grbpwr.com", { primaryHost: A }), null);
    assert.equal(staticHostRedirect("www.grbpwr.com"), "grbpwr.com");
    assert.equal(staticHostRedirect(`www.${A}`), null);
  });
  it("profile primary host is trusted only when listed, else the request host", () => {
    const parse = (extra: Record<string, unknown>) =>
      parseShopProfile({ shopKey: "k", name: "N", ...extra }, `www.${A}`)!;
    const listed = parse({
      primaryHost: A.toUpperCase(),
      hosts: [A, `WWW.${A}.`, A, "localhost", "x.vercel.app", "https://e.x/"],
    });
    assert.equal(listed.primaryHost, A);
    assert.deepEqual(listed.hosts, [A, `www.${A}`]);
    // Canonical / sitemap origin falls back to the request host.
    assert.equal(
      parse({ primaryHost: "evil.example" }).primaryHost,
      `www.${A}`,
    );
    assert.equal(
      parse({ primaryHost: "evil.example", hosts: [A] }).primaryHost,
      `www.${A}`,
    );
    assert.equal(parse({ primaryHost: A, hosts: [] }).primaryHost, `www.${A}`);
    assert.deepEqual(parse({}).hosts, []);
  });
  it("serves pack icons and files only on pack hosts", () => {
    assert.equal(
      packRootFile("/favicon.ico", GRBPWR_PACK),
      "/brands/grbpwr/favicon.ico",
    );
    assert.equal(packRootFile("/favicon.ico", undefined), null);
    assert.ok(isPackRootFileName("/favicon.ico"));
    assert.ok(!isPackRootFileName("/fonts/x.woff2"));
    assert.ok(
      packPublicFileAllowed("/brands/grbpwr/content/faq/faq.md", GRBPWR_PACK),
    );
    assert.ok(
      !packPublicFileAllowed("/brands/grbpwr/content/faq/faq.md", undefined),
    );
    assert.ok(isRootRouteHandler("/sitemap.xml"));
    assert.ok(isRootRouteHandler("/.well-known/api-catalog"));
    assert.ok(!isRootRouteHandler(`/${A}/en`));
  });
});

describe("stripe key", () => {
  it("own key / connected account / grbpwr env / nothing", () => {
    assert.deepEqual(
      stripeLoadArgs({
        profileKey: "pk_shop",
        accountId: "acct_1",
        platformKey: "pk_plat",
      }),
      { publishableKey: "pk_shop", stripeAccount: "acct_1" },
    );
    assert.deepEqual(
      stripeLoadArgs({ accountId: "acct_1", platformKey: "pk_plat" }),
      { publishableKey: "pk_plat", stripeAccount: "acct_1" },
    );
    assert.deepEqual(
      stripeLoadArgs({
        pack: GRBPWR_PACK,
        platformKey: "pk_plat",
        grbpwrKey: "pk_grb",
      }),
      { publishableKey: "pk_grb" },
    );
    assert.deepEqual(
      stripeLoadArgs({ pack: GRBPWR_PACK, platformKey: "pk_plat" }),
      { publishableKey: "pk_plat" },
    );
    // Another shop without its own account never gets a key.
    assert.equal(
      stripeLoadArgs({ platformKey: "pk_plat", grbpwrKey: "pk_grb" }),
      null,
    );
  });
});

describe("session cookie bridge", () => {
  const jar = (c: Record<string, string>) => ({
    get: (n: string) => (n in c ? { value: c[n]! } : undefined),
  });
  const NEW = [
    "__Host-shop_access",
    "__Host-shop_refresh",
    "__Host-shop_access_exp",
  ];
  const OLD = ["grbpwr_access", "grbpwr_refresh", "grbpwr_access_exp"];
  const session = {
    accessToken: "a2",
    refreshToken: "r2",
    accessExpiresAt: "2030-01-01T00:15:00Z",
  };
  const now = Date.parse("2030-01-01T00:00:00Z");

  it("grbpwr hosts read the legacy cookies; other hosts only the new ones", () => {
    const legacy = jar({ grbpwr_access: "old-a", grbpwr_refresh: "old-r" });
    assert.deepEqual(sessionTokensFrom(legacy, "grbpwr.com"), {
      access: "old-a",
      refresh: "old-r",
    });
    const none = { access: undefined, refresh: undefined };
    assert.deepEqual(sessionTokensFrom(legacy, A), none);
    assert.deepEqual(
      sessionTokensFrom(legacy, "grbpwr.shop.lekalo.studio"),
      none,
    );
    const fresh = jar({
      "__Host-shop_access": "a",
      "__Host-shop_refresh": "r",
    });
    assert.deepEqual(sessionTokensFrom(fresh, A), {
      access: "a",
      refresh: "r",
    });
    // The old storefront (after a rollback) rotated only the legacy set: that
    // set is the live one on grbpwr hosts.
    const rolledBack = jar({
      "__Host-shop_access": "stale-a",
      "__Host-shop_refresh": "stale-r",
      grbpwr_access: "old-a",
      grbpwr_refresh: "old-r",
    });
    assert.deepEqual(sessionTokensFrom(rolledBack, "grbpwr.com"), {
      access: "old-a",
      refresh: "old-r",
    });
  });

  it("login / refresh writes both sets on grbpwr hosts, never deletes the legacy ones", () => {
    const writes = sessionCookieWrites(session, "grbpwr.com", now);
    assert.deepEqual(
      writes.map((w) => w.name),
      [...NEW, ...OLD],
    );
    for (const w of writes) {
      assert.ok(w.options.maxAge > 0, `${w.name} is set, not cleared`);
      assert.equal(w.options.secure, true);
      assert.equal(w.options.httpOnly, true);
      assert.equal(w.options.path, "/");
      assert.equal("domain" in w.options, false);
    }
    const byName = Object.fromEntries(writes.map((w) => [w.name, w]));
    assert.equal(byName.grbpwr_access!.value, "a2");
    assert.equal(byName.grbpwr_refresh!.value, "r2");
    assert.equal(byName.grbpwr_access!.options.maxAge, 15 * 60);
    assert.equal(byName.grbpwr_refresh!.options.maxAge, 60 * 60 * 24 * 30);
    // What the old storefront would read after a rollback: the rotated tokens.
    const afterRollback = jar(
      Object.fromEntries(writes.map((w) => [w.name, w.value])),
    );
    assert.deepEqual(sessionTokensFrom(afterRollback, "grbpwr.com"), {
      access: "a2",
      refresh: "r2",
    });
  });

  it("other shops get only the __Host- set; no tokens, no cookies", () => {
    assert.deepEqual(
      sessionCookieWrites(session, A, now).map((w) => w.name),
      NEW,
    );
    assert.deepEqual(
      sessionCookieWrites(session, null, now).map((w) => w.name),
      NEW,
    );
    assert.deepEqual(
      sessionCookieWrites({ accessToken: "a" }, "grbpwr.com", now),
      [],
    );
  });

  it("logout clears both sets", () => {
    const clears = sessionCookieClears();
    assert.deepEqual(clears.map((c) => c.name).sort(), [...NEW, ...OLD].sort());
    for (const c of clears) {
      assert.equal(c.value, "");
      assert.equal(c.options.maxAge, 0);
      assert.equal(c.options.path, "/");
    }
  });
});

describe("revalidation secret bridge", () => {
  it("per-shop secret always; the old secret only on a pack host", async () => {
    const shopSecret = await deriveShopRevalidateSecret("m", "t1");
    const base = { shopKey: "t1", master: "m", legacySecret: "old" };
    assert.ok(
      await revalidateSecretAccepted({
        ...base,
        secret: shopSecret,
        pack: undefined,
      }),
    );
    assert.ok(
      await revalidateSecretAccepted({
        ...base,
        secret: "old",
        pack: GRBPWR_PACK,
      }),
    );
    assert.ok(
      !(await revalidateSecretAccepted({
        ...base,
        secret: "old",
        pack: undefined,
      })),
    );
    assert.ok(
      !(await revalidateSecretAccepted({
        ...base,
        secret: "x",
        pack: GRBPWR_PACK,
      })),
    );
    assert.ok(
      !(await revalidateSecretAccepted({
        ...base,
        master: undefined,
        legacySecret: undefined,
        secret: "",
        pack: GRBPWR_PACK,
      })),
    );
  });
});

describe("HSTS", () => {
  it("includeSubDomains only on grbpwr and lekalo hosts", () => {
    for (const h of [
      "grbpwr.com",
      "www.grbpwr.com",
      "beta.grbpwr.com",
      A,
      "x7-test.shop.beta.lekalo.studio",
    ]) {
      assert.equal(hstsFor(h), HSTS_WITH_SUBDOMAINS, h);
    }
    for (const h of [
      "brand.com",
      "shop.brand.com",
      "grbpwr.com.evil.example",
      "notgrbpwr.com",
      "lekalo.studio.example",
      "x.vercel.app",
    ]) {
      assert.equal(hstsFor(h), HSTS_HOST_ONLY, h);
    }
    assert.equal(HSTS_HOST_ONLY.includes("includeSubDomains"), false);
  });
});
