import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { UpdateAccountRequest } from "@/api/proto-http/frontend";

import { createAccountServiceClient } from "./authed-client";
import { ACCESS_COOKIE } from "./session-cookies";

export async function updateAccountResponse(
  body: UpdateAccountRequest,
): Promise<NextResponse> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (!access) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = createAccountServiceClient(() => access);
  try {
    const { account } = await client.UpdateAccount(body);
    return NextResponse.json({ account });
  } catch (e) {
    const message = e instanceof Error ? e.message : "update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
