// Server-only access to the current request's shop (RSC, route handlers, actions).
import { cache } from "react";
import { getCurrentShopHost } from "#shop-current-host";

import { fetchShopProfile, type ShopProfileResult } from "./profile.ts";

/** Profile of the shop on this request's host; one backend round-trip per request (60 s data cache). */
export const getShopProfile = cache(
  async (): Promise<ShopProfileResult> =>
    fetchShopProfile(await getCurrentShopHost(), {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
      fetchImpl: fetch,
    }),
);

/** Origin (https://<primary host>) for canonical URLs, sitemap and structured data. */
/** Null when the host has no open shop: SEO routes answer 404 then. */
export async function getShopOrigin(): Promise<string | null> {
  const shop = await getShopProfile();
  return shop.status === "ok" ? `https://${shop.profile.primaryHost}` : null;
}

/** Brand fields metadata, structured data and agent texts need on the server. */
export type ShopMeta = {
  name: string;
  legalName: string;
  description?: string;
  logoUrl?: string;
  email?: string;
  /** https://<primary host>, no trailing slash. */
  origin: string;
};

export async function getShopMeta(): Promise<ShopMeta> {
  const shop = await getShopProfile();
  const p =
    shop.status === "ok" || shop.status === "closed" ? shop.profile : undefined;
  const host = p?.primaryHost ?? shop.host ?? "localhost";
  const name = p?.name ?? host;
  return {
    name,
    legalName: p?.legalName ?? name,
    description: p?.description,
    logoUrl: p?.logoUrl,
    email: p?.email,
    origin: `https://${host}`,
  };
}
