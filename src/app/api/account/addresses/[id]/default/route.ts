import { NextResponse } from "next/server";

import { setDefaultSavedAddressResponse } from "@/lib/storefront-account/account-addresses";

export async function POST(
  _req: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  return setDefaultSavedAddressResponse(parsedId);
}
