import { verifyAccountMagicLinkResponse } from "@/lib/storefront-account/account-auth";
import {
  getMagicLinkToken,
  getSafeRelativeRedirect,
} from "@/lib/storefront-account/magic-link";
import { NextResponse } from "next/server";



type RequestError = Error & { code?: number; status?: number; message?: string };

function getMagicLinkErrorCode(error: unknown): string {
  const e = error as RequestError | undefined;
  const status = e?.status ?? e?.code;
  const message = (e?.message ?? "").toLowerCase();

  if (status === 503 || status === 502 || status === 504) {
    return "backend_unavailable";
  }
  if (status === 429) {
    return "rate_limited";
  }
  if (status === 401 || status === 403) {
    if (message.includes("expired") || message.includes("ttl")) return "expired";
    if (message.includes("used") || message.includes("consumed")) return "used";
    if (message.includes("invalid")) return "invalid";
    return "unauthorized";
  }
  if (status === 400) {
    if (message.includes("expired")) return "expired";
    if (message.includes("used") || message.includes("consumed")) return "used";
    if (message.includes("invalid")) return "invalid";
    return "bad_request";
  }
  return "invalid_or_expired_link";
}

function buildRedirectWithError(origin: string, redirectTo: string, errorCode: string): URL {
  const target = new URL(redirectTo, origin);
  target.searchParams.set("login_error", errorCode);
  return target;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = getMagicLinkToken(url.searchParams);
  const redirectTo = getSafeRelativeRedirect(
    url.searchParams.get("redirect_to") ?? url.searchParams.get("next") ?? undefined,
    "/account",
  );

  if (!token) {
    return NextResponse.redirect(buildRedirectWithError(url.origin, redirectTo, "missing_token"));
  }

  try {
    const response = await verifyAccountMagicLinkResponse(token);
    return NextResponse.redirect(new URL(redirectTo, url.origin), {
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.redirect(
      buildRedirectWithError(url.origin, redirectTo, getMagicLinkErrorCode(error)),
    );
  }
}

export async function POST(req: Request) {
  const { token } = (await req.json()) as { token?: string };
  if (!token?.trim()) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  return verifyAccountMagicLinkResponse(token);
}
