import { cookies } from "next/headers";

import type { RefreshAccountSessionResponse } from "@/api/proto-http/frontend";

import { createAccountServiceClient } from "./authed-client";
import { isUnauthorizedError, tryRefreshAccountSessionFromCookies } from "./account-auth";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./session-cookies";

export type AccountServiceClient = ReturnType<typeof createAccountServiceClient>;

/**
 * Successful RPC after at most one refresh retry.
 * `refreshed` is non-null when the first access token was rejected and refresh succeeded.
 */
export type AccountSessionOk<T> = {
  ok: true;
  data: T;
  refreshed: RefreshAccountSessionResponse | null;
};

export type AccountSessionFail = {
  ok: false;
  /** No usable account session cookies */
  reason: "no_access";
} | {
  ok: false;
  /** 401 on RPC but refresh missing or backend refresh failed */
  reason: "refresh_failed";
};

export type AccountSessionResult<T> = AccountSessionOk<T> | AccountSessionFail;

/**
 * Runs an authenticated storefront RPC with the access token from cookies.
 * On 401, attempts one refresh via refresh cookie, then retries the same RPC once.
 * Rethrows non-auth errors so callers can map validation vs auth.
 */
export async function executeWithAccountSession<T>(
  call: (client: AccountServiceClient) => Promise<T>,
): Promise<AccountSessionResult<T>> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) {
    return { ok: false, reason: "no_access" };
  }

  let currentAccess = access;
  let refreshed: RefreshAccountSessionResponse | null = null;

  async function refreshSession(): Promise<boolean> {
    refreshed = await tryRefreshAccountSessionFromCookies();
    if (!refreshed?.accessToken) return false;
    currentAccess = refreshed.accessToken;
    return true;
  }

  if (!currentAccess && !(await refreshSession())) {
    return { ok: false, reason: "refresh_failed" };
  }

  let client = createAccountServiceClient(() => currentAccess);

  try {
    const data = await call(client);
    return { ok: true, data, refreshed };
  } catch (e) {
    if (!isUnauthorizedError(e)) {
      throw e;
    }

    if (!(await refreshSession())) {
      return { ok: false, reason: "refresh_failed" };
    }

    client = createAccountServiceClient(() => currentAccess);
    const data = await call(client);
    return { ok: true, data, refreshed };
  }
}
