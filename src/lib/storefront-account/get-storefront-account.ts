import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { executeWithAccountSession } from "./session-executor";

export async function getStorefrontAccount(): Promise<StorefrontAccount | null> {
  try {
    const result = await executeWithAccountSession((client) =>
      client.GetAccount({}),
    );
    if (!result.ok) return null;
    return result.data.account ?? null;
  } catch {
    // Match /api/account/me: backend 5xx/network errors must not crash RSC
    // (template.tsx + checkout page call this on every router.refresh()).
    return null;
  }
}
