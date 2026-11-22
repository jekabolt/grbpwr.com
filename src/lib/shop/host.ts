// Multi-shop host handling (X18). One deployment serves every team's shop; the
// request host is the only thing that says which shop a request belongs to.
// Pure module (no Next/React imports) so it runs in middleware, the server, the
// browser and the node test runner alike.

/** Header the backend resolves the shop from (gateway: Grpc-Metadata-X-Shop-Host). */
export const SHOP_HOST_HEADER = "x-shop-host";

/** Query parameter appended to every backend URL so Next's data cache keys differ per shop. */
export const SHOP_QUERY_PARAM = "shop";

const LABEL = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
const HOST_RE = new RegExp(`^(?=.{1,253}$)${LABEL}(?:\\.${LABEL})*$`);

/**
 * Canonical form of a request host: lower case, first value of a comma list,
 * no port, no trailing dot, no leading `www.`. Anything that is not a plain DNS
 * name (IPv6 literals, empty, junk) yields null — callers fail closed on null.
 */
export function normalizeShopHost(raw?: string | null): string | null {
  if (!raw) return null;
  let host = raw.split(",")[0]!.trim().toLowerCase();
  host = host.replace(/:\d{1,5}$/, "").replace(/\.$/, "");
  if (host.startsWith("www.")) host = host.slice(4);
  return HOST_RE.test(host) ? host : null;
}

/** Hosts that are never a shop of their own: local dev and Vercel preview URLs. */
export function isDevelopmentHost(host: string): boolean {
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ||
    host.endsWith(".vercel.app")
  );
}

/**
 * Resolves the shop host for a raw request host. On localhost / *.vercel.app the
 * shop named by `devHost` (NEXT_PUBLIC_SHOP_DEV_HOST) is used instead, so a
 * preview deployment or `pnpm dev` can render a real shop. Elsewhere the
 * override is ignored: a production host always speaks for itself.
 */
export function resolveShopHost(
  rawHost: string | null | undefined,
  devHost: string | null | undefined,
): string | null {
  const host = normalizeShopHost(rawHost);
  if (!host) return null;
  if (isDevelopmentHost(host)) {
    return normalizeShopHost(devHost) ?? null;
  }
  return host;
}

/** Cache tag namespaced by shop: one shop's revalidation never touches another's. */
export function shopCacheTag(host: string, tag: string): string {
  return `shop:${host}:${tag}`;
}

/**
 * Backend URL for a generated-client path with the shop appended as a query
 * parameter. Next keys its data cache on the URL, so two shops asking the same
 * RPC never share an entry even if a header were dropped on the way.
 */
export function shopBackendUrl(
  backendUrl: string,
  path: string,
  host: string,
): string {
  const base = backendUrl.replace(/\/+$/, "");
  const rel = path.replace(/^\/+/, "");
  const sep = rel.includes("?") ? "&" : "?";
  return `${base}/${rel}${sep}${SHOP_QUERY_PARAM}=${encodeURIComponent(host)}`;
}

/** Error thrown when a backend call has no shop host — never fall back to a default team. */
export class MissingShopHostError extends Error {
  constructor() {
    super(
      "shop host unknown: refusing to call the backend without x-shop-host",
    );
    this.name = "MissingShopHostError";
  }
}
