// Session cookie names and the read side of the grbpwr bridge. Pure module (no
// Next imports): the node test runner covers it.
import { GRBPWR_LEGACY_COOKIE_HOSTS } from "../../brands/grbpwr/config.ts";

// lekalo-shop: `__Host-` cookies are bound by the browser to the exact shop host
// (Secure, Path=/, no Domain allowed), so a session on one shop is never sent to
// another shop on a sibling *.shop.lekalo.studio host. Never add a `domain`.
export const ACCESS_COOKIE = "__Host-shop_access";
export const REFRESH_COOKIE = "__Host-shop_refresh";
export const ACCESS_EXPIRES_COOKIE = "__Host-shop_access_exp";

// Bridge for grbpwr's pre-lekalo session (read old, write new): customers stay
// signed in across the move. Read only on grbpwr's own hosts and only while no
// new cookie is set — elsewhere a sibling host could toss one in (fixation).
export const LEGACY_ACCESS_COOKIE = "grbpwr_access";
export const LEGACY_REFRESH_COOKIE = "grbpwr_refresh";
export const LEGACY_ACCESS_EXPIRES_COOKIE = "grbpwr_access_exp";

export type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

/** Session tokens in `store` for a request to `host`. */
export function sessionTokensFrom(
  store: CookieReader,
  host: string | null,
): { access?: string; refresh?: string } {
  const access = store.get(ACCESS_COOKIE)?.value || undefined;
  const refresh = store.get(REFRESH_COOKIE)?.value || undefined;
  if (access || refresh) return { access, refresh };
  if (!host || !GRBPWR_LEGACY_COOKIE_HOSTS.includes(host)) return {};
  return {
    access: store.get(LEGACY_ACCESS_COOKIE)?.value || undefined,
    refresh: store.get(LEGACY_REFRESH_COOKIE)?.value || undefined,
  };
}
