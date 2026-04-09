import { RefreshAccountSessionResponse, VerifyAccountLoginResponse } from "@/api/proto-http/frontend";


export const ACCESS_COOKIES = 'grbpwr_access';
export const REFRESH_COOKIES = 'grbpwr_refresh';
const EXPIRES_AT_COOKIES = 'grbpwr_access_exp';

const isProd = process.env.NODE_ENV === 'production';

const baseCookie = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
}

export function applySessionCookies(
    res: { cookies: { set: (n: string, v: string, o: object) => void } },
    payload: VerifyAccountLoginResponse | RefreshAccountSessionResponse,
) {
    const access = payload.accessToken;
    const refresh = payload.refreshToken;
    const exp = payload.accessExpiresAt;

    if (!access || !refresh) return;

    res.cookies.set(ACCESS_COOKIES, access, {
        ...baseCookie,
        maxAge: 60 * 15,
    });
    res.cookies.set(REFRESH_COOKIES, refresh, {
        ...baseCookie,
        maxAge: 60 * 60 * 24 * 30,
    });
    if (exp) {
        res.cookies.set(EXPIRES_AT_COOKIES, exp, {
            ...baseCookie,
            maxAge: 60 * 60 * 24 * 30,
        });
    }
}

export function clearSessionCookies(res: {
    cookies: { set: (n: string, v: string, o: object) => void };
}) {
    const clear = { ...baseCookie, maxAge: 0 };
    res.cookies.set(ACCESS_COOKIES, "", clear);
    res.cookies.set(REFRESH_COOKIES, "", clear);
    res.cookies.set(EXPIRES_AT_COOKIES, "", clear);
}