import { routing } from "@/i18n/routing";
import { serviceClient } from "@/lib/api";

import {
  CATALOG_SITEMAP_HUB_PATHS,
  collectCatalogSitemapPaths,
  PAGES_SITEMAP_PATHS,
} from "./catalog-paths";
import type { SitemapUrlEntry } from "./serialize-xml";

export const SITEMAP_PUBLIC_BASE_URL = "https://grbpwr.com";

export const CANONICAL_COUNTRY_BY_LOCALE = {
  en: "gb",
  fr: "fr",
  de: "de",
  it: "it",
  ja: "jp",
  zh: "cn",
  ko: "kr",
} satisfies Record<(typeof routing.locales)[number], string>;

export const SITEMAP_REVALIDATE_SECONDS = 3600;

/** Child sitemap URLs (linked from `/sitemap.xml` index). */
export const SITEMAP_CHILD_DOCUMENT_RELATIVE = {
  pages: "/sitemap_pages.xml",
  catalog: "/sitemap_catalog.xml",
  products: "/sitemap_products.xml",
} as const;

function catalogPriority(path: string): number {
  if (path === "/catalog" || path === "/catalog/men" || path === "/catalog/women") {
    return 0.9;
  }
  return 0.75;
}

function pagesPriority(path: string): number {
  if (path === "") return 1;
  return 0.85;
}

function expandRelPaths(
  relPaths: readonly string[],
  priorityFor: (path: string) => number,
): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const now = new Date();

  for (const locale of routing.locales) {
    const country = CANONICAL_COUNTRY_BY_LOCALE[locale];

    for (const path of relPaths) {
      const urlPath = `/${country}/${locale}${path}`;
      entries.push({
        url: `${SITEMAP_PUBLIC_BASE_URL}${urlPath}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: priorityFor(path),
      });
    }
  }

  return entries;
}

export function buildPagesSitemapEntries(): SitemapUrlEntry[] {
  return expandRelPaths(PAGES_SITEMAP_PATHS, pagesPriority);
}

export async function buildCatalogSitemapEntries(): Promise<SitemapUrlEntry[]> {
  let relPaths: string[] = [...CATALOG_SITEMAP_HUB_PATHS];

  try {
    const { dictionary } = await serviceClient.GetHero({});
    const categories = dictionary?.categories;
    if (categories?.length) relPaths = collectCatalogSitemapPaths(categories);
  } catch {
    // Catalog hubs only if hero/dictionary fails.
  }

  return expandRelPaths(relPaths, catalogPriority);
}
