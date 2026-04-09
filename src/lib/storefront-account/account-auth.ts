import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { serviceClient } from "@/lib/api";


import { createAccountServiceClient } from "./authed-client";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  applySessionCookies,
  clearSessionCookies,
} from "./session-cookies";

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
    return NextResponse.json({ error: "email and code are required" }, { status: 400 });
  }
  const session = await serviceClient.VerifyAccountLoginCode({
    email,
    code: code.trim(),
  });
  const res = NextResponse.json({ account: session.account });
  applySessionCookies(res, session);
  return res;
}

export async function verifyAccountMagicLinkResponse(token: string): Promise<NextResponse> {
  const session = await serviceClient.VerifyAccountMagicLink({ token: token.trim() });
  const res = NextResponse.json({ account: session.account });
  applySessionCookies(res, session);
  return res;
}

export async function refreshAccountSessionResponse(): Promise<NextResponse> {
  const store = await cookies();
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "no session found" }, { status: 401 });
  }

  try {
    const session = await serviceClient.RefreshAccountSession({ refreshToken: refresh });
    const res = NextResponse.json({});
    applySessionCookies(res, session);
    return res;
  } catch {
    const res = NextResponse.json({ error: "failed to refresh session" }, { status: 401 });
    clearSessionCookies(res);
    return res;
  }
}

export async function revokeAccountSessionResponse(): Promise<NextResponse> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const refresh = store.get(REFRESH_COOKIE)?.value;

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
