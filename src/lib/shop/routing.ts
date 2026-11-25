// Host → route decisions of the middleware (X18 v3). Pure module: no Next
// imports, so the node test runner covers it.
//
// Every page lives under src/app/[shop]/[locale]/…; the middleware rewrites the
// public URL /{country}/{locale}/{rest} to /{shop host}/{locale}/{rest}. The
// `[shop]` segment therefore always comes from the request host, never from the
// URL a visitor typed: any path that reaches the app router without the
// middleware could name another shop, so the matcher must cover every page path.
import {
  GRBPWR_HOST_REDIRECTS,
  GRBPWR_PUBLIC_DIR,
  GRBPWR_ROOT_FILES,
  GRBPWR_STAY_HOSTS,
} from "../../brands/grbpwr/config.ts";
import type { ShopPack } from "../../brands/index.ts";
import { isDevelopmentHost } from "./host.ts";

/** Root route handlers that read the host themselves (no `[shop]` segment). */
const ROOT_ROUTE_HANDLERS = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap_catalog.xml",
  "/sitemap_pages.xml",
  "/sitemap_products.xml",
  "/manifest.json",
  "/.well-known/api-catalog",
  "/openapi/frontend.json",
]);

export function isRootRouteHandler(pathname: string): boolean {
  return ROOT_ROUTE_HANDLERS.has(pathname);
}

/** Static files under public/ that every host may load. */
export function isSharedPublicFile(pathname: string): boolean {
  return pathname.startsWith("/fonts/");
}

/** public/brands/<pack>/… — served only on that pack's hosts. */
export function isPackPublicFile(pathname: string): boolean {
  return pathname.startsWith("/brands/");
}

/** May this host load this public/brands file? */
export function packPublicFileAllowed(
  pathname: string,
  pack: ShopPack | undefined,
): boolean {
  return pack !== undefined && pathname.startsWith(`${GRBPWR_PUBLIC_DIR}/`);
}

/** /favicon.ico & co: a pack's root files (a host without a pack has none). */
export function isPackRootFileName(pathname: string): boolean {
  return GRBPWR_ROOT_FILES.includes(pathname);
}

/** Root icon of a pack host (/favicon.ico …) → its file under public/brands. */
export function packRootFile(
  pathname: string,
  pack: ShopPack | undefined,
): string | null {
  if (!pack || !GRBPWR_ROOT_FILES.includes(pathname)) return null;
  return `${GRBPWR_PUBLIC_DIR}${pathname}`;
}

/** Internal path of a page: /{shop host}/{locale}{rest}. */
export function shopPagePath(
  host: string,
  locale: string,
  rest: string,
): string {
  return `/${encodeURIComponent(host)}/${locale}${rest}`;
}

/** Fixed host 308s of a pack (www.grbpwr.com → grbpwr.com). */
export function staticHostRedirect(host: string): string | null {
  return GRBPWR_HOST_REDIRECTS[host] ?? null;
}

/** Can this host be moved to a primary host at all? (Worth a profile read.) */
export function mayRedirectToPrimary(host: string): boolean {
  return !isDevelopmentHost(host) && !GRBPWR_STAY_HOSTS.includes(host);
}

/**
 * Host to 308 to, from the shop profile's primary host: only a real, different,
 * listed host; never from a dev/preview host or a host the pack pins in place.
 */
export function primaryHostRedirect(
  host: string,
  profile: { primaryHost?: string; hosts?: string[] } | null | undefined,
): string | null {
  if (!profile?.primaryHost || !mayRedirectToPrimary(host)) return null;
  const primary = profile.primaryHost.toLowerCase();
  if (primary === host || isDevelopmentHost(primary)) return null;
  if (profile.hosts?.length && !profile.hosts.includes(primary)) return null;
  return primary;
}
