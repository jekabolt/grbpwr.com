import { NextResponse } from "next/server";
import type { RefreshAccountSessionResponse } from "@/api/proto-http/frontend";

import { applySessionCookies, clearSessionCookies } from "./session-cookies";

/** JSON body + optional rotated session cookies (after refresh). */
export async function jsonWithRefreshedSession(
  body: unknown,
  refreshed: RefreshAccountSessionResponse | null,
): Promise<NextResponse> {
  const res = NextResponse.json(body);
  if (refreshed) await applySessionCookies(res, refreshed);
  return res;
}

/** Login / explicit refresh: set cookies from full session payload. */
export async function jsonWithSessionCookies(
  body: unknown,
  session: Parameters<typeof applySessionCookies>[1],
): Promise<NextResponse> {
  const res = NextResponse.json(body);
  await applySessionCookies(res, session);
  return res;
}

export function unauthorizedAccountResponse(
  clearCookies: boolean,
): NextResponse {
  const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (clearCookies) clearSessionCookies(res);
  return res;
}
