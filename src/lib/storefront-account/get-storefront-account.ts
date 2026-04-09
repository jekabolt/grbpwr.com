import { cookies } from "next/headers";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { createAccountServiceClient } from "./authed-client";
import { ACCESS_COOKIE } from "./session-cookies";

export async function getStorefrontAccount(): Promise<StorefrontAccount | null> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (!access) return null;

  const client = createAccountServiceClient(() => access);
  try {
    const { account } = await client.GetAccount({});
    return account ?? null;
  } catch {
    return null;
  }
}
