import { revalidateTag } from "next/cache";
import {
  ARCHIVES_CACHE_TAG,
  HERO_CACHE_TAG,
  PRODUCTS_CACHE_TAG,
} from "@/constants";

import { normalizeShopHost, shopCacheTag } from "@/lib/shop/host";
import { SHOP_PROFILE_TAG } from "@/lib/shop/profile";
import {
  deriveShopRevalidateSecret,
  safeEqual,
} from "@/lib/shop/revalidate-secret";
import { getShopProfile } from "@/lib/shop/server";

// lekalo-shop: revalidation is per shop. The backend posts to
// https://<shop host>/api/revalidate?secret=<HKDF(SHOP_REVALIDATE_MASTER,
// "revalidate:"+shopKey)> (or header x-revalidate-secret); only that shop's
// tags (`shop:<host>:<tag>`, every host of the shop) are dropped. Pages are
// rendered dynamically, so no revalidatePath is needed.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret =
    searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  const data = await request.json().catch(() => null);

  if (!data || !secret) {
    return Response.json(
      { error: "No body or secret provided" },
      { status: 400 },
    );
  }

  const master = process.env.SHOP_REVALIDATE_MASTER;
  const shop = await getShopProfile();
  const profile =
    shop.status === "ok" || shop.status === "closed" ? shop.profile : undefined;
  if (!master || !profile) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }
  const expected = await deriveShopRevalidateSecret(master, profile.shopKey);
  if (!safeEqual(secret, expected)) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  const hosts = new Set<string>();
  if (shop.host) hosts.add(shop.host);
  for (const h of [profile.primaryHost, ...(profile.hosts ?? [])]) {
    const n = normalizeShopHost(h);
    if (n) hosts.add(n);
  }

  const tags: string[] = [];
  if (Array.isArray(data.products) && data.products.length > 0) {
    tags.push(PRODUCTS_CACHE_TAG);
  }
  if (data.hero === true) tags.push(HERO_CACHE_TAG);
  if (typeof data.archive === "number" || typeof data.archive === "string") {
    tags.push(ARCHIVES_CACHE_TAG);
  }
  if (data.profile === true) tags.push(SHOP_PROFILE_TAG);

  for (const host of hosts) {
    for (const tag of tags) revalidateTag(shopCacheTag(host, tag));
  }

  return Response.json({
    revalidated: true,
    now: Date.now(),
  });
}
