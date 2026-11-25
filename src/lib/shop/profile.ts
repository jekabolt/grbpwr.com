// Shop profile (brand block) of the team that owns the request host.
// Contract (X18, backend lane L1 — FrontendService.GetShopProfile):
//   GET {NEXT_PUBLIC_BACKEND_URL}/api/frontend/shop/profile   header x-shop-host: <host>
//   200 { "profile": ShopProfile }            shop known (open or closed via `open`)
//   404 message contains "shop_closed"        shop exists but is switched off
//   404 otherwise                             no shop on this host
// Pure module: no Next/React imports (fetch is injected), so the node test runner
// can exercise it directly.
import { SHOP_HOST_HEADER, shopBackendUrl, shopCacheTag } from "./host.ts";

export type ShopColors = {
  /** Highlight / selection colour (grbpwr: electric blue). */
  accent?: string;
  /** Second accent (grbpwr: acid yellow). */
  accentSecondary?: string;
  background?: string;
  text?: string;
};

export type ShopLink = { text: string; href: string };

export type ShopProfile = {
  /** Opaque stable key of the shop (HKDF info for the revalidation secret). Never shown. */
  shopKey: string;
  /** Brand name as written in the workspace brand block. */
  name: string;
  /** Legal entity for imprint / legal pages; falls back to `name`. */
  legalName?: string;
  description?: string;
  logoUrl?: string;
  /** Client-services address shown in help / footer. */
  email?: string;
  address?: string;
  colors?: ShopColors;
  socials?: ShopLink[];
  /** Host the shop is canonically served on (sitemap, canonical, og:url). */
  primaryHost: string;
  /** Every live host of the shop, primary included (revalidation fans out to all). */
  hosts?: string[];
  currencies?: string[];
  baseCurrency?: string;
  /** Stripe Connect account (`acct_…`) for direct charges; empty = team pasted its own keys. */
  stripeAccountId?: string;
  /** Publishable key: the team's own (pasted keys) or empty → platform key from env. */
  stripePublishableKey?: string;
  open: boolean;
  /** Optional per-shop legal markdown, keyed by page slug (e.g. "terms-conditions"). */
  legal?: Record<string, string>;
  /**
   * Code pack the operator assigned ("grbpwr"), exactly as sent: undefined when
   * the backend does not send the field yet, "" when the shop has none.
   */
  pack?: string;
};

export type ShopProfileResult =
  | { status: "ok"; host: string; profile: ShopProfile }
  | { status: "closed"; host: string; profile?: ShopProfile }
  | { status: "unknown"; host: string | null }
  /** Backend unreachable / 5xx: not cached as a 404, the page errors and retries. */
  | { status: "error"; host: string };

export const SHOP_PROFILE_PATH = "api/frontend/shop/profile";
export const SHOP_PROFILE_TAG = "profile";
/**
 * Safety net only: the backend revalidates `shop:<host>:profile` on every brand
 * change. The lowest fetch TTL becomes the page's ISR interval, so a short TTL
 * would re-render every page of every shop that often.
 */
export const SHOP_PROFILE_TTL_SECONDS = 3600;

type FetchLike = (
  input: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
) => Promise<Pick<Response, "ok" | "status" | "text">>;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function color(v: unknown): string | undefined {
  const s = str(v);
  return s && HEX_COLOR.test(s) ? s : undefined;
}

function httpsUrl(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  try {
    return new URL(s).protocol === "https:" ? s : undefined;
  } catch {
    return undefined;
  }
}

/** Validates and narrows the backend payload; drops anything unsafe to render. */
export function parseShopProfile(
  raw: unknown,
  host: string,
): ShopProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const name = str(p.name);
  const shopKey = str(p.shopKey);
  if (!name || !shopKey) return null;
  const c = (p.colors ?? {}) as Record<string, unknown>;
  const socials = Array.isArray(p.socials)
    ? (p.socials as Record<string, unknown>[])
        .map((s) => ({ text: str(s?.text), href: httpsUrl(s?.href) }))
        .filter((s): s is ShopLink => Boolean(s.text && s.href))
    : undefined;
  const hosts = Array.isArray(p.hosts)
    ? (p.hosts as unknown[]).map(str).filter((h): h is string => Boolean(h))
    : undefined;
  const legal =
    p.legal && typeof p.legal === "object"
      ? Object.fromEntries(
          Object.entries(p.legal as Record<string, unknown>)
            .map(([k, v]) => [k, str(v)] as const)
            .filter((e): e is readonly [string, string] => Boolean(e[1])),
        )
      : undefined;
  return {
    shopKey,
    name,
    legalName: str(p.legalName),
    description: str(p.description),
    logoUrl: httpsUrl(p.logoUrl),
    email: str(p.email),
    address: str(p.address),
    colors: {
      accent: color(c.accent),
      accentSecondary: color(c.accentSecondary),
      background: color(c.background),
      text: color(c.text),
    },
    socials,
    primaryHost: str(p.primaryHost) ?? host,
    hosts,
    currencies: Array.isArray(p.currencies)
      ? (p.currencies as unknown[])
          .map(str)
          .filter((x): x is string => Boolean(x))
      : undefined,
    baseCurrency: str(p.baseCurrency),
    stripeAccountId: str(p.stripeAccountId),
    stripePublishableKey: str(p.stripePublishableKey),
    open: p.open !== false,
    legal,
    pack: typeof p.pack === "string" ? p.pack.trim() : undefined,
  };
}

/** Fetches the profile for one host. Never throws; transport failures are "error". */
export async function fetchShopProfile(
  host: string | null,
  opts: { backendUrl: string; fetchImpl: FetchLike },
): Promise<ShopProfileResult> {
  if (!host) return { status: "unknown", host: null };
  let res: Awaited<ReturnType<FetchLike>>;
  try {
    res = await opts.fetchImpl(
      shopBackendUrl(opts.backendUrl, SHOP_PROFILE_PATH, host),
      {
        method: "GET",
        headers: { [SHOP_HOST_HEADER]: host },
        next: {
          revalidate: SHOP_PROFILE_TTL_SECONDS,
          tags: [shopCacheTag(host, SHOP_PROFILE_TAG)],
        },
      },
    );
  } catch {
    return { status: "error", host };
  }
  const text = await res.text().catch(() => "");
  let body: Record<string, unknown> | null = null;
  try {
    body = text ? (JSON.parse(text) as Record<string, unknown>) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const message = typeof body?.message === "string" ? body.message : text;
    if (res.status === 404 && message.includes("shop_closed")) {
      return { status: "closed", host };
    }
    return res.status === 404
      ? { status: "unknown", host }
      : { status: "error", host };
  }
  const profile = parseShopProfile(body?.profile, host);
  if (!profile) return { status: "unknown", host };
  return profile.open
    ? { status: "ok", host, profile }
    : { status: "closed", host, profile };
}

/** Brand subset safe to hand to client components. */
export function toShopBrand(profile: ShopProfile) {
  return {
    name: profile.name,
    legalName: profile.legalName ?? profile.name,
    logoUrl: profile.logoUrl,
    email: profile.email,
    address: profile.address,
    socials: profile.socials ?? [],
    primaryHost: profile.primaryHost,
    stripeAccountId: profile.stripeAccountId,
    stripePublishableKey: profile.stripePublishableKey,
    legal: profile.legal,
  };
}

/**
 * CSS custom properties overriding the storefront palette with the shop's
 * colours (values are validated hex in parseShopProfile, so safe to inline).
 */
export function shopThemeCss(colors: ShopColors | undefined): string {
  if (!colors) return "";
  const accent: string[] = [];
  if (colors.accent)
    accent.push(
      `--highlight:${colors.accent}`,
      `--text-select:${colors.accent}`,
    );
  if (colors.accentSecondary)
    accent.push(`--inverted:${colors.accentSecondary}`);
  // Background/text only in the light theme: the black timeline theme keeps its own.
  const base: string[] = [];
  if (colors.background) base.push(`--background:${colors.background}`);
  if (colors.text) base.push(`--text:${colors.text}`);
  return [
    accent.length ? `:root{${accent.join(";")}}` : "",
    base.length ? `:root:not(.blackTheme){${base.join(";")}}` : "",
  ].join("");
}
