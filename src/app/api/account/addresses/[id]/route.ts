import { NextResponse } from "next/server";

import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";
import {
  deleteSavedAddressResponse,
  updateSavedAddressResponse,
} from "@/lib/storefront-account/account-addresses";

function isSavedAddress(value: unknown): value is StorefrontSavedAddress {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.country === "string" &&
    typeof d.city === "string" &&
    typeof d.addressLineOne === "string" &&
    typeof d.postalCode === "string"
  );
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const raw = (await req.json()) as Record<string, unknown>;
  if (!isSavedAddress(raw.address)) {
    return NextResponse.json({ error: "invalid address payload" }, { status: 400 });
  }

  return updateSavedAddressResponse(parsedId, raw.address);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  return deleteSavedAddressResponse(parsedId);
}
