import { revalidateTag } from "next/cache";
import { resolvePack } from "@/brands";
import { GRBPWR_HOSTS, GRBPWR_PACK } from "@/brands/grbpwr/config";
import {
  ARCHIVES_CACHE_TAG,
  HERO_CACHE_TAG,
  PRODUCTS_CACHE_TAG,
} from "@/constants";

import { normalizeShopHost, shopCacheTag } from "@/lib/shop/host";
import { SHOP_PROFILE_TAG } from "@/lib/shop/profile";
import { revalidateSecretAccepted } from "@/lib/shop/revalidate-secret";
import { getShopProfile } from "@/lib/shop/server";

// lekalo-shop: revalidation is per shop. The backend posts to
// https://<shop host>/api/revalidate?secret=<HKDF(SHOP_REVALIDATE_MASTER,
// "revalidate:"+shopKey)> (or header x-revalidate-secret); only that shop's
// tags (`shop:<host>:<tag>`, every host of the shop) are dropped. ISR pages
// carry the tags of the fetches they made, so dropping a tag also re-renders
// that shop's pages; no revalidatePath is needed. grbpwr's backend still posts
// the old WEBHOOK_REVALIDATE_SECRET: accepted on grbpwr pack hosts only.
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

  const shop = await getShopProfile();
  const profile =
    shop.status === "ok" || shop.status === "closed" ? shop.profile : undefined;
  if (!profile) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }
  const pack = resolvePack(profile.pack, shop.host);
  const accepted = await revalidateSecretAccepted({
    secret,
    shopKey: profile.shopKey,
    master: process.env.SHOP_REVALIDATE_MASTER,
    pack,
    legacySecret: process.env.WEBHOOK_REVALIDATE_SECRET,
  });
  if (!accepted) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  const hosts = new Set<string>();
  if (shop.host) hosts.add(shop.host);
  if (pack === GRBPWR_PACK) for (const h of GRBPWR_HOSTS) hosts.add(h);
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
