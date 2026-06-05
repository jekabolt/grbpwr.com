import { routing } from "@/i18n/routing";
import {
  getLatestArchiveDate,
  getLatestProductDate,
  serviceClient,
} from "@/lib/api";

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
  // Real content date per path (not build time) — omitted when unavailable.
  lastModifiedFor?: (path: string) => string | undefined,
): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];

  for (const path of relPaths) {
    const alternates = hreflangAlternates(path);
    const lastModified = lastModifiedFor?.(path);
    for (const locale of routing.locales) {
      entries.push({
        url: localizedSitemapUrl(locale, path),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "daily",
        priority: priorityFor(path),
        alternates,
      });
    }
  }

  return entries;
}

export async function buildPagesSitemapEntries(): Promise<SitemapUrlEntry[]> {
  // Freshness from real content: homepage tracks the newest product, timeline the
  // newest archive.
  const [productDate, archiveDate] = await Promise.all([
    getLatestProductDate(),
    getLatestArchiveDate(),
  ]);
  return expandRelPaths(PAGES_SITEMAP_PATHS, pagesPriority, (path) =>
    path === "/timeline" ? archiveDate : productDate,
  );
}

export async function buildCatalogSitemapEntries(): Promise<SitemapUrlEntry[]> {
  let relPaths: string[] = [...CATALOG_SITEMAP_HUB_PATHS];

  const [{ categories } = { categories: undefined }, productDate] =
    await Promise.all([
      serviceClient
        .GetHero({})
        .then((r) => ({ categories: r.dictionary?.categories }))
        .catch(() => ({ categories: undefined })),
      getLatestProductDate(),
    ]);

  if (categories?.length) relPaths = collectCatalogSitemapPaths(categories);

  return expandRelPaths(relPaths, catalogPriority, () => productDate);
}
