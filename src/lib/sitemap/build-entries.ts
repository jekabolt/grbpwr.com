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

/** Absolute URL for a relative path in a given locale's canonical country. */
export function localizedSitemapUrl(
  locale: (typeof routing.locales)[number],
  relPath: string,
): string {
  const country = CANONICAL_COUNTRY_BY_LOCALE[locale];
  return `${SITEMAP_PUBLIC_BASE_URL}/${country}/${locale}${relPath}`;
}

/** hreflang alternates for a relative path: every locale + x-default (default locale). */
export function hreflangAlternates(
  relPath: string,
): { hreflang: string; href: string }[] {
  const alternates: { hreflang: string; href: string }[] = routing.locales.map(
    (locale) => ({
      hreflang: locale,
      href: localizedSitemapUrl(locale, relPath),
    }),
  );
  alternates.push({
    hreflang: "x-default",
    href: localizedSitemapUrl(routing.defaultLocale, relPath),
  });
  return alternates;
}

function expandRelPaths(
  relPaths: readonly string[],
  priorityFor: (path: string) => number,
): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];

  for (const path of relPaths) {
    const alternates = hreflangAlternates(path);
    for (const locale of routing.locales) {
      // lastModified is intentionally omitted: these are stable hubs, and a
      // build-time value would reset every deploy and erode lastmod trust.
      entries.push({
        url: localizedSitemapUrl(locale, path),
        changeFrequency: "daily",
        priority: priorityFor(path),
        alternates,
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
