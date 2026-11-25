// node --test (Node ≥ 22.18 strips TS types natively). Proves the X18 isolation
// rules: two shop hosts → two brands, two cache keys, two tag namespaces.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { shopIdentityMarkdown, shopMarkdown } from "./content.ts";
import {
  normalizeShopHost,
  resolveShopHost,
  SHOP_HOST_HEADER,
  shopBackendUrl,
  shopCacheTag,
} from "./host.ts";
import {
  fetchShopProfile,
  shopThemeCss,
  toShopBrand,
  type ShopProfileResult,
} from "./profile.ts";
import { deriveShopRevalidateSecret, safeEqual } from "./revalidate-secret.ts";

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
    assert.equal(normalizeShopHost("WWW.Acme.Shop.Lekalo.Studio:443"), A);
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
