import { verifyAccountMagicLinkResponse } from "@/lib/storefront-account/account-auth";
import {
  getMagicLinkToken,
  getSafeRelativeRedirect,
} from "@/lib/storefront-account/magic-link";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = getMagicLinkToken(url.searchParams);
  const redirectTo = getSafeRelativeRedirect(
    url.searchParams.get("redirect_to") ?? url.searchParams.get("next") ?? undefined,
    "/account",
  );

  if (!token) {
    return NextResponse.redirect(
      new URL(`${redirectTo}?login_error=missing_token`, url.origin),
    );
  }

  try {
    const response = await verifyAccountMagicLinkResponse(token);
    return NextResponse.redirect(new URL(redirectTo, url.origin), {
      headers: response.headers,
    });
  } catch {
    return NextResponse.redirect(
      new URL(`${redirectTo}?login_error=invalid_or_expired_link`, url.origin),
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
