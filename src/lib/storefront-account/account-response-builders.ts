import { NextResponse } from "next/server";

import type { RefreshAccountSessionResponse } from "@/api/proto-http/frontend";

import { applySessionCookies, clearSessionCookies } from "./session-cookies";

/** JSON body + optional rotated session cookies (after refresh). */
export function jsonWithRefreshedSession(
  body: unknown,
  refreshed: RefreshAccountSessionResponse | null,
): NextResponse {
  const res = NextResponse.json(body);
  if (refreshed) applySessionCookies(res, refreshed);
  return res;
}

/** Login / explicit refresh: set cookies from full session payload. */
export function jsonWithSessionCookies(
  body: unknown,
  session: Parameters<typeof applySessionCookies>[1],
): NextResponse {
  const res = NextResponse.json(body);
  applySessionCookies(res, session);
  return res;
}

export function unauthorizedAccountResponse(clearCookies: boolean): NextResponse {
  const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (clearCookies) clearSessionCookies(res);
  return res;
}
