import type {
  RefreshAccountSessionResponse,
  VerifyAccountLoginResponse,
} from "@/api/proto-http/frontend";
import { getCurrentShopHost } from "#shop-current-host";

import {
  ACCESS_COOKIE,
  ACCESS_EXPIRES_COOKIE,
  LEGACY_ACCESS_COOKIE,
  LEGACY_ACCESS_EXPIRES_COOKIE,
  LEGACY_REFRESH_COOKIE,
  REFRESH_COOKIE,
  sessionTokensFrom,
  type CookieReader,
} from "./session-tokens";

export { ACCESS_COOKIE, REFRESH_COOKIE, sessionTokensFrom };

/** Session tokens of this request (new `__Host-` cookies, else grbpwr's legacy ones). */
export async function readSessionTokens(
  store: CookieReader,
): Promise<{ access?: string; refresh?: string }> {
  return sessionTokensFrom(store, await getCurrentShopHost());
}

const baseCookie = {
  httpOnly: true,
  // Always Secure: session/refresh tokens must never travel over plain HTTP
  // (e.g. a preview/staging deploy on a real domain). Browsers still send
  // Secure cookies over http://localhost, so local dev is unaffected.
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

function maxAgeSecondsFromAccessExpiry(
  accessExpiresAt: string | undefined,
): number | undefined {
  if (!accessExpiresAt) return undefined;
  const ms = Date.parse(accessExpiresAt);
  if (Number.isNaN(ms)) return undefined;
  return Math.max(0, Math.floor((ms - Date.now()) / 1000));
}

const FALLBACK_ACCESS_MAX_AGE = 60 * 15;

export function applySessionCookies(
  res: { cookies: { set: (n: string, v: string, o: object) => void } },
  payload: VerifyAccountLoginResponse | RefreshAccountSessionResponse,
) {
  const access = payload.accessToken;
  const refresh = payload.refreshToken;
  const exp = payload.accessExpiresAt;

  if (!access || !refresh) return;

  const accessMaxAge =
    maxAgeSecondsFromAccessExpiry(exp) ?? FALLBACK_ACCESS_MAX_AGE;

  res.cookies.set(ACCESS_COOKIE, access, {
    ...baseCookie,
    maxAge: accessMaxAge,
  });
  res.cookies.set(REFRESH_COOKIE, refresh, {
    ...baseCookie,
    maxAge: 60 * 60 * 24 * 30,
  });
  if (exp) {
    res.cookies.set(ACCESS_EXPIRES_COOKIE, exp, {
      ...baseCookie,
      maxAge: accessMaxAge,
    });
  }
  clearLegacySessionCookies(res);
}

/** Drops grbpwr's legacy cookies once the session lives under the new names. */
function clearLegacySessionCookies(res: {
  cookies: { set: (n: string, v: string, o: object) => void };
}) {
  const clear = { ...baseCookie, maxAge: 0 };
  res.cookies.set(LEGACY_ACCESS_COOKIE, "", clear);
  res.cookies.set(LEGACY_REFRESH_COOKIE, "", clear);
  res.cookies.set(LEGACY_ACCESS_EXPIRES_COOKIE, "", clear);
}

export function clearSessionCookies(res: {
  cookies: { set: (n: string, v: string, o: object) => void };
}) {
  const clear = { ...baseCookie, maxAge: 0 };
  res.cookies.set(ACCESS_COOKIE, "", clear);
  res.cookies.set(REFRESH_COOKIE, "", clear);
  res.cookies.set(ACCESS_EXPIRES_COOKIE, "", clear);
  clearLegacySessionCookies(res);
}
