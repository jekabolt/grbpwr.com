import { NextResponse } from "next/server";

import type { UpdateAccountRequest } from "@/api/proto-http/frontend";
import { updateAccountResponse } from "@/lib/storefront-account/account-update";

export async function POST(req: Request) {
  const raw = (await req.json()) as Record<string, unknown>;
  const body: UpdateAccountRequest = {};

  if (raw.phone !== undefined) {
    if (typeof raw.phone !== "string") {
      return NextResponse.json({ error: "phone must be a string" }, { status: 400 });
    }
    body.phone = raw.phone;
  }
  if (raw.firstName !== undefined && typeof raw.firstName === "string") {
    body.firstName = raw.firstName;
  }
  if (raw.lastName !== undefined && typeof raw.lastName === "string") {
    body.lastName = raw.lastName;
  }
  if (raw.defaultCountry !== undefined && typeof raw.defaultCountry === "string") {
    body.defaultCountry = raw.defaultCountry;
  }
  if (raw.defaultLanguage !== undefined && typeof raw.defaultLanguage === "string") {
    body.defaultLanguage = raw.defaultLanguage;
  }

  if (Object.keys(body).length === 0) {
    return NextResponse.json({ error: "no valid fields" }, { status: 400 });
  }

  return updateAccountResponse(body);
}
