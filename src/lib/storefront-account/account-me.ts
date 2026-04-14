import { NextResponse } from "next/server";

import { getStorefrontAccount } from "./get-storefront-account";

/** Proxies the same data as backend `GET api/frontend/account/me` (see GetAccount in proto client). */
export async function getAccountMeResponse(): Promise<NextResponse> {
  const account = await getStorefrontAccount();
  if (!account) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ account });
}
