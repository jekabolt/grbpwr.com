import { NextResponse } from "next/server";

import { deleteSavedAddressResponse } from "@/lib/storefront-account/account-addresses";

export async function DELETE(
  _req: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  return deleteSavedAddressResponse(parsedId);
}
