// Server half of `#shop-current-host` (picked by the `react-server` condition in
// package.json "imports"): RSC, route handlers and server actions read the
// request host from the incoming headers.
import { headers } from "next/headers";

import { resolveShopHost } from "./host.ts";

export async function getCurrentShopHost(): Promise<string | null> {
  try {
    const h = await headers();
    return resolveShopHost(
      // `host` first (Vercel passes the visitor's host there, same as the
      // middleware's www check); x-forwarded-host only behind a local proxy.
      h.get("host") ?? h.get("x-forwarded-host"),
      process.env.NEXT_PUBLIC_SHOP_DEV_HOST,
    );
  } catch {
    // Outside a request (build-time prerender): no shop. Callers fail closed.
    return null;
  }
}
