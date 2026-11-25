import type {
  RefreshAccountSessionResponse,
  VerifyAccountLoginResponse,
} from "@/api/proto-http/frontend";
import { getCurrentShopHost } from "#shop-current-host";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  sessionCookieClears,
  sessionCookieWrites,
  sessionTokensFrom,
  type CookieReader,
} from "./session-tokens";

export { ACCESS_COOKIE, REFRESH_COOKIE, sessionTokensFrom };

type CookieSink = {
  cookies: { set: (n: string, v: string, o: object) => void };
};

/** Session tokens of this request (grbpwr's legacy cookies on its own hosts). */
export async function readSessionTokens(
  store: CookieReader,
): Promise<{ access?: string; refresh?: string }> {
  return sessionTokensFrom(store, await getCurrentShopHost());
}

/** Sets the rotated session (both cookie sets on grbpwr's hosts). */
export async function applySessionCookies(
  res: CookieSink,
  payload: VerifyAccountLoginResponse | RefreshAccountSessionResponse,
): Promise<void> {
  const host = await getCurrentShopHost();
  for (const c of sessionCookieWrites(payload, host)) {
    res.cookies.set(c.name, c.value, c.options);
  }
}

/** Ends the session: clears the new and the legacy cookies. */
export function clearSessionCookies(res: CookieSink) {
  for (const c of sessionCookieClears()) {
    res.cookies.set(c.name, c.value, c.options);
  }
}
