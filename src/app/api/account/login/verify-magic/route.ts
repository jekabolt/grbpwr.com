import { NextResponse } from "next/server";

import { verifyAccountMagicLinkResponse } from "@/lib/storefront-account";

export async function POST(req: Request) {
  const { token } = (await req.json()) as { token?: string };
  if (!token?.trim()) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  return verifyAccountMagicLinkResponse(token);
}
