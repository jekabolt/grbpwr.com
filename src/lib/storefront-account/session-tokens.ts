// Session cookie names, their attributes and the grbpwr bridge. Pure module (no
// Next imports): the node test runner covers it.
import { GRBPWR_LEGACY_COOKIE_HOSTS } from "../../brands/grbpwr/config.ts";

// lekalo-shop: `__Host-` cookies are bound by the browser to the exact shop host
// (Secure, Path=/, no Domain allowed), so a session on one shop is never sent to
// another shop on a sibling *.shop.lekalo.studio host. Never add a `domain`.
export const ACCESS_COOKIE = "__Host-shop_access";
export const REFRESH_COOKIE = "__Host-shop_refresh";
export const ACCESS_EXPIRES_COOKIE = "__Host-shop_access_exp";

// grbpwr's pre-lekalo session cookies. On grbpwr's own hosts every login and
// refresh writes the rotated tokens under both names, so a rollback to the old
// storefront (which reads only these) keeps everyone signed in.
export const LEGACY_ACCESS_COOKIE = "grbpwr_access";
export const LEGACY_REFRESH_COOKIE = "grbpwr_refresh";
export const LEGACY_ACCESS_EXPIRES_COOKIE = "grbpwr_access_exp";

const NEW_SET = [ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_EXPIRES_COOKIE] as const;
const LEGACY_SET = [
  LEGACY_ACCESS_COOKIE,
  LEGACY_REFRESH_COOKIE,
  LEGACY_ACCESS_EXPIRES_COOKIE,
] as const;

export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
export const FALLBACK_ACCESS_MAX_AGE = 60 * 15;

// Same attributes for both sets (the legacy ones exactly as the old storefront
// wrote them). Always Secure: tokens never travel over plain HTTP; browsers
// still send Secure cookies over http://localhost, so local dev works.
const BASE_COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
} as const;

export type SessionCookieOptions = typeof BASE_COOKIE & { maxAge: number };
export type SessionCookieWrite = {
  name: string;
  value: string;
  options: SessionCookieOptions;
};

export type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

/** Does this host still carry grbpwr's pre-lekalo cookies? */
export function usesLegacySessionCookies(host: string | null): boolean {
  return !!host && GRBPWR_LEGACY_COOKIE_HOSTS.includes(host);
}

/**
 * Session tokens in `store` for a request to `host`. On grbpwr's hosts the
 * legacy cookies are the source of truth while the bridge lives: this
 * storefront writes both sets in step, the old one writes only the legacy set,
 * so after a rollback and roll-forward the legacy set is the fresh one (and a
 * logout on the old storefront is honoured). Anywhere else only the
 * `__Host-` set counts: a sibling host could toss in an unprefixed cookie.
 */
export function sessionTokensFrom(
  store: CookieReader,
  host: string | null,
): { access?: string; refresh?: string } {
  const [access, refresh] = usesLegacySessionCookies(host)
    ? LEGACY_SET
    : NEW_SET;
  return {
    access: store.get(access)?.value || undefined,
    refresh: store.get(refresh)?.value || undefined,
  };
}

function maxAgeSecondsFromAccessExpiry(
  accessExpiresAt: string | undefined,
  nowMs: number,
): number | undefined {
  if (!accessExpiresAt) return undefined;
  const ms = Date.parse(accessExpiresAt);
  if (Number.isNaN(ms)) return undefined;
  return Math.max(0, Math.floor((ms - nowMs) / 1000));
}

/** Cookies a login / refresh response sets (nothing without both tokens). */
export function sessionCookieWrites(
  payload: {
    accessToken?: string;
    refreshToken?: string;
    accessExpiresAt?: string;
  },
  host: string | null,
  nowMs: number = Date.now(),
): SessionCookieWrite[] {
  const { accessToken: access, refreshToken: refresh } = payload;
  const exp = payload.accessExpiresAt;
  if (!access || !refresh) return [];
  const accessMaxAge =
    maxAgeSecondsFromAccessExpiry(exp, nowMs) ?? FALLBACK_ACCESS_MAX_AGE;
  const sets = usesLegacySessionCookies(host)
    ? [NEW_SET, LEGACY_SET]
    : [NEW_SET];
  const writes: SessionCookieWrite[] = [];
  for (const [accessName, refreshName, expName] of sets) {
    writes.push(
      {
        name: accessName,
        value: access,
        options: { ...BASE_COOKIE, maxAge: accessMaxAge },
      },
      {
        name: refreshName,
        value: refresh,
        options: { ...BASE_COOKIE, maxAge: REFRESH_MAX_AGE },
      },
    );
    if (exp) {
      writes.push({
        name: expName,
        value: exp,
        options: { ...BASE_COOKIE, maxAge: accessMaxAge },
      });
    }
  }
  return writes;
}

/** Cookies a logout / failed refresh clears: both sets, on every host. */
export function sessionCookieClears(): SessionCookieWrite[] {
  return [...NEW_SET, ...LEGACY_SET].map((name) => ({
    name,
    value: "",
    options: { ...BASE_COOKIE, maxAge: 0 },
  }));
}
