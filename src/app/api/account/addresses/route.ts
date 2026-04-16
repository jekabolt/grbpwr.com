import { NextResponse } from "next/server";

import type { AddSavedAddressRequest, StorefrontSavedAddress } from "@/api/proto-http/frontend";
import {
  addSavedAddressResponse,
  listSavedAddressesResponse,
} from "@/lib/storefront-account/account-addresses";

function isSavedAddress(value: unknown): value is StorefrontSavedAddress {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.country === "string" &&
    typeof data.city === "string" &&
    typeof data.addressLineOne === "string" &&
    typeof data.postalCode === "string"
  );
}

export async function GET() {
  return listSavedAddressesResponse();
}

export async function POST(req: Request) {
  const raw = (await req.json()) as Record<string, unknown>;
  if (!isSavedAddress(raw.address)) {
    return NextResponse.json({ error: "invalid address payload" }, { status: 400 });
  }

  const body: AddSavedAddressRequest = {
    address: raw.address,
  };
  return addSavedAddressResponse(body);
}
