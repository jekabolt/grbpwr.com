// Server half of `#shop-current-host` (picked by the `react-server` condition in
// package.json "imports"). Pages and layouts take the host from the `[shop]`
// segment (request-host.ts) — under ISR there are no headers. Route handlers and
// server actions run per request and read the incoming headers.
import { headers } from "next/headers";

import { resolveShopHost } from "./host.ts";
import { getRequestShop } from "./request-host.ts";

export async function getCurrentShopHost(): Promise<string | null> {
  const fromSegment = getRequestShop();
  if (fromSegment) return fromSegment;
  try {
    const h = await headers();
    return resolveShopHost(
      // `host` first (Vercel passes the visitor's host there); x-forwarded-host
      // only behind a local proxy.
      h.get("host") ?? h.get("x-forwarded-host"),
      process.env.NEXT_PUBLIC_SHOP_DEV_HOST,
    );
  } catch {
    // Outside a request (build-time prerender): no shop. Callers fail closed.
    return null;
  }
}
