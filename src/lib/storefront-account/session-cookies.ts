import type {
  RefreshAccountSessionResponse,
  VerifyAccountLoginResponse,
} from "@/api/proto-http/frontend";

export const ACCESS_COOKIE = "grbpwr_access";
export const REFRESH_COOKIE = "grbpwr_refresh";
const ACCESS_EXPIRES_COOKIE = "grbpwr_access_exp";

const isProd = process.env.NODE_ENV === "production";

const baseCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export function applySessionCookies(
  res: { cookies: { set: (n: string, v: string, o: object) => void } },
  payload: VerifyAccountLoginResponse | RefreshAccountSessionResponse,
) {
  const access = payload.accessToken;
  const refresh = payload.refreshToken;
  const exp = payload.accessExpiresAt;

  if (!access || !refresh) return;

  res.cookies.set(ACCESS_COOKIE, access, {
    ...baseCookie,
    maxAge: 60 * 15,
  });
  res.cookies.set(REFRESH_COOKIE, refresh, {
    ...baseCookie,
    maxAge: 60 * 60 * 24 * 30,
  });
  if (exp) {
    res.cookies.set(ACCESS_EXPIRES_COOKIE, exp, {
      ...baseCookie,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearSessionCookies(res: {
  cookies: { set: (n: string, v: string, o: object) => void };
}) {
  const clear = { ...baseCookie, maxAge: 0 };
  res.cookies.set(ACCESS_COOKIE, "", clear);
  res.cookies.set(REFRESH_COOKIE, "", clear);
  res.cookies.set(ACCESS_EXPIRES_COOKIE, "", clear);
}
