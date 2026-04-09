import { NextResponse } from "next/server";

import { requestAccountLoginEmail } from "@/lib/storefront-account";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  await requestAccountLoginEmail(email);
  return NextResponse.json({});
}
