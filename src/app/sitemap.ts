import { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const baseUrl = "https://grbpwr.com";

/**
 * Public URLs use /{country}/{locale}/… (see middleware). Use one canonical
 * country so each logical page appears once in the sitemap; `gb` matches
 * getNormalizedCountry fallback when geo is unknown.
 */
const CANONICAL_COUNTRY = "gb";

/** Locale-agnostic path segments after /{country}/{locale} */
const STATIC_PATHS = [
  "",
  "/catalog",
  "/catalog/men",
  "/catalog/women",
  "/catalog/objects",
  "/timeline",
  "/faq",
  "/client-services",
  "/return",
  "/legal-notices",
  "/aftersale-services",
  "/order-status",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const urlPath = `/${CANONICAL_COUNTRY}/${locale}${path}`;
      const isHome = path === "";

      entries.push({
        url: `${baseUrl}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: isHome ? 1 : 0.8,
      });
    }
  }

  return entries;
}
