// Browser half of `#shop-current-host` (the `default` condition). During SSR of a
// client component there is no window and no request headers here: return null
// so the caller fails closed instead of guessing a shop.
import { resolveShopHost } from "./host.ts";

export async function getCurrentShopHost(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return resolveShopHost(
    window.location.host,
    process.env.NEXT_PUBLIC_SHOP_DEV_HOST,
  );
}
