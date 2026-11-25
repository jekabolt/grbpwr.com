import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { RefreshAccountSessionResponse } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";

import { jsonWithSessionCookies } from "./account-response-builders";
import { createAccountServiceClient } from "./authed-client";
import { clearSessionCookies, readSessionTokens } from "./session-cookies";

type RefreshFlight = {
  promise: Promise<RefreshAccountSessionResponse>;
  result: RefreshAccountSessionResponse | null;
  resultExpiresAt: number;
};

const REFRESH_RESULT_REUSE_MS = 10_000;

const refreshFlights = ((
  globalThis as typeof globalThis & {
    __accountRefreshFlights?: Map<string, RefreshFlight>;
  }
).__accountRefreshFlights ??= new Map<string, RefreshFlight>());

function pruneExpiredRefreshFlights(now: number) {
  for (const [token, flight] of refreshFlights) {
    if (flight.result && flight.resultExpiresAt <= now) {
      refreshFlights.delete(token);
    }
  }
}

/**
 * Refresh tokens rotate on every successful backend call. Coalesce concurrent
 * requests with the same old refresh token so only one backend refresh burns it.
 */
export async function refreshAccountSession(
  refreshToken: string,
): Promise<RefreshAccountSessionResponse> {
  const now = Date.now();
  pruneExpiredRefreshFlights(now);

  const existing = refreshFlights.get(refreshToken);
  if (existing) {
    if (existing.result && existing.resultExpiresAt > now) {
      return existing.result;
    }
    if (!existing.result) {
      return existing.promise;
    }
    refreshFlights.delete(refreshToken);
  }

  const flight: RefreshFlight = {
    result: null,
    resultExpiresAt: 0,
    promise: serviceClient
      .RefreshAccountSession({ refreshToken })
      .then((session) => {
        flight.result = session;
        flight.resultExpiresAt = Date.now() + REFRESH_RESULT_REUSE_MS;
        return session;
      })
      .catch((error) => {
        refreshFlights.delete(refreshToken);
        throw error;
      }),
  };

  refreshFlights.set(refreshToken, flight);
  return flight.promise;
}

export async function requestAccountLoginEmail(email: string): Promise<void> {
  if (!email.trim()) {
    throw new Error("email is required");
  }
  await serviceClient.RequestAccountLogin({ email });
}

export async function verifyAccountLoginCodeResponse(
  email: string,
  code: string,
): Promise<NextResponse> {
  if (!email.trim() || !code.trim()) {
    return NextResponse.json(
      { error: "email and code are required" },
      { status: 400 },
    );
  }
  const session = await serviceClient.VerifyAccountLoginCode({
    email,
    code: code.trim(),
  });
  return await jsonWithSessionCookies({ account: session.account }, session);
}

export async function verifyAccountMagicLinkResponse(
  token: string,
): Promise<NextResponse> {
  const session = await serviceClient.VerifyAccountMagicLink({
    token: token.trim(),
  });
  return await jsonWithSessionCookies({ account: session.account }, session);
}

export async function refreshAccountSessionResponse(): Promise<NextResponse> {
  const { refresh } = await readSessionTokens(await cookies());
  if (!refresh) {
    return NextResponse.json({ error: "no session found" }, { status: 401 });
  }

  try {
    const session = await refreshAccountSession(refresh);
    return await jsonWithSessionCookies({}, session);
  } catch {
    const res = NextResponse.json(
      { error: "failed to refresh session" },
      { status: 401 },
    );
    clearSessionCookies(res);
    return res;
  }
}

type AuthError = Error & { code?: number; status?: number };

export function isUnauthorizedError(error: unknown): boolean {
  const e = error as AuthError | undefined;
  return e?.status === 401 || e?.code === 401 || e?.code === 16;
}

export async function tryRefreshAccountSessionFromCookies(): Promise<RefreshAccountSessionResponse | null> {
  const { refresh } = await readSessionTokens(await cookies());
  if (!refresh) return null;

  try {
    return await refreshAccountSession(refresh);
  } catch {
    return null;
  }
}

export async function revokeAccountSessionResponse(): Promise<NextResponse> {
  const { access, refresh } = await readSessionTokens(await cookies());

  const res = NextResponse.json({});

  if (access && refresh) {
    const client = createAccountServiceClient(() => access);
    try {
      await client.RevokeAccountSession({ refreshToken: refresh });
    } catch {
      /* still clear cookies */
    }
  }

  clearSessionCookies(res);
  return res;
}
