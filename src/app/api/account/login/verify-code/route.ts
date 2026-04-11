import { verifyAccountLoginCodeResponse } from "@/lib/storefront-account/account-auth";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  const { email, code } = (await req.json()) as { email?: string; code?: string };
  if (!email?.trim() || !code?.trim()) {
    return NextResponse.json({ error: "email and code are required" }, { status: 400 });
  }

  return verifyAccountLoginCodeResponse(email, code);
}
