// Server-only access to the current request's shop (RSC, route handlers, actions).
import { cache } from "react";
import { resolvePack, type ShopPack } from "@/brands";
import { GRBPWR_PACK, GRBPWR_SITE } from "@/brands/grbpwr/config";
import {
  GRBPWR_HOME_OG,
  GRBPWR_HOME_TITLE,
  GRBPWR_ICONS,
  GRBPWR_OG_IMAGE_URL,
} from "@/brands/grbpwr/metadata";
import { getCurrentShopHost } from "#shop-current-host";

import type { ShopBrand } from "@/components/contexts/ShopContext";

import {
  fetchShopProfile,
  toShopBrand,
  type ShopProfile,
  type ShopProfileResult,
} from "./profile.ts";

/** One backend round-trip per request and host (Next data cache below that). */
const profileFor = cache(
  async (host: string | null): Promise<ShopProfileResult> =>
    fetchShopProfile(host, {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
      fetchImpl: fetch,
    }),
);

/** Profile of the shop this request renders (the `[shop]` segment, else the host header). */
export async function getShopProfile(): Promise<ShopProfileResult> {
  return profileFor(await getCurrentShopHost());
}

function profileOf(shop: ShopProfileResult): ShopProfile | undefined {
  return shop.status === "ok" || shop.status === "closed"
    ? shop.profile
    : undefined;
}

/** Code pack of this request's shop (grbpwr's extras), if any. */
export async function getShopPack(): Promise<ShopPack | undefined> {
  const shop = await getShopProfile();
  return resolvePack(profileOf(shop)?.pack, shop.host);
}

/** Brand fields for client components, with the pack's own values on top. */
export function shopBrandOf(
  profile: ShopProfile,
  pack: ShopPack | undefined,
): ShopBrand {
  const brand: ShopBrand = { ...toShopBrand(profile), pack };
  if (pack === GRBPWR_PACK) {
    brand.name = GRBPWR_SITE.name;
    brand.brandName = GRBPWR_SITE.brandName;
    brand.primaryHost = new URL(GRBPWR_SITE.origin).host;
    brand.email = GRBPWR_SITE.email;
    brand.socials = GRBPWR_SITE.socials.map((s) => ({ ...s }));
  }
  return brand;
}

/** Origin (https://<primary host>) for canonical URLs, sitemap and structured data. */
/** Null when the host has no open shop: SEO routes answer 404 then. */
export async function getShopOrigin(): Promise<string | null> {
  const shop = await getShopProfile();
  if (shop.status !== "ok") return null;
  if (resolvePack(shop.profile.pack, shop.host) === GRBPWR_PACK) {
    return GRBPWR_SITE.origin;
  }
  return `https://${shop.profile.primaryHost || shop.host}`;
}

/** Brand fields metadata, structured data and agent texts need on the server. */
export type ShopMeta = {
  /** Titles and og:site_name. */
  name: string;
  /** Short name inside copy (archive fallback title). */
  displayName: string;
  /** Brand as a proper name: JSON-LD, apple web app title, og image alt. */
  brandName: string;
  legalName: string;
  /** Profile description; undefined for a pack (its copy is a localized message). */
  description?: string;
  /** Absolute logo URL (JSON-LD logo, default og image, icons). */
  logoUrl?: string;
  email?: string;
  /** https://<primary host>, no trailing slash. */
  origin: string;
  pack?: ShopPack;
  /** Default og / twitter image when it is not the logo. */
  ogImageUrl?: string;
  /** Home page title and link preview. */
  homeTitle?: string;
  homeOg?: {
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
  };
  /** <link rel=icon / apple-touch-icon> when they are not the logo. */
  icons?: {
    icon?: string;
    apple?: { url: string; sizes?: string }[];
  };
  sameAs?: string[];
};

export async function getShopMeta(): Promise<ShopMeta> {
  const shop = await getShopProfile();
  const p = profileOf(shop);
  const host = p?.primaryHost || shop.host || "localhost";
  const name = p?.name ?? host;
  const pack = resolvePack(p?.pack, shop.host);
  const meta: ShopMeta = {
    name,
    displayName: name,
    brandName: name,
    legalName: p?.legalName ?? name,
    description: p?.description,
    logoUrl: p?.logoUrl,
    email: p?.email,
    origin: `https://${host}`,
    pack,
  };
  if (pack === GRBPWR_PACK) {
    const origin = GRBPWR_SITE.origin;
    return {
      ...meta,
      name: GRBPWR_SITE.siteName,
      displayName: GRBPWR_SITE.name,
      brandName: GRBPWR_SITE.brandName,
      // Localized: pages fall back to the pack's `meta.description` message.
      description: undefined,
      logoUrl: `${origin}/app-logo.webp`,
      email: GRBPWR_SITE.clientServicesEmail,
      origin,
      ogImageUrl: GRBPWR_OG_IMAGE_URL,
      homeTitle: GRBPWR_HOME_TITLE,
      homeOg: { ...GRBPWR_HOME_OG },
      icons: GRBPWR_ICONS,
      sameAs: [...GRBPWR_SITE.sameAs],
    };
  }
  return meta;
}
