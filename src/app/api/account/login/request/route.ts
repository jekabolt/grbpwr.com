import { requestAccountLoginEmail } from "@/lib/storefront-account/account-auth";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  await requestAccountLoginEmail(email);
  return NextResponse.json({});
}
