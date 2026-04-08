import type { common_Category } from "@/api/proto-http/frontend";

import {
  filterSubCategories,
  isCategoryDisabled,
  processCategories,
} from "@/lib/categories-map";

/** Non-catalog URLs (sitemap “pages” file). */
export const PAGES_SITEMAP_PATHS = ["", "/timeline"] as const;

/** Catalog hubs only (plus dictionary-driven paths in `collectCatalogSitemapPaths`). */
export const CATALOG_SITEMAP_HUB_PATHS = [
  "/catalog",
  "/catalog/men",
  "/catalog/women",
  "/catalog/objects",
] as const;

/** Relative paths under `/catalog` for sitemap: hubs + dictionary URLs (mirrors nav rules). */
export function collectCatalogSitemapPaths(
  categories: common_Category[],
): string[] {
  const paths = new Set<string>();
  for (const p of CATALOG_SITEMAP_HUB_PATHS) paths.add(p);

  const processed = processCategories(categories);

  for (const top of processed) {
    const topSlug = top.name.toLowerCase();
    const topEntity = categories.find(
      (c) => c.level === "top_category" && c.id === top.id,
    );
    if (!topEntity?.name) continue;

    paths.add(top.href);
    for (const sub of top.subCategories) {
      paths.add(sub.href);
    }

    if (topSlug === "objects") continue;

    for (const gender of ["men", "women"] as const) {
      if (gender === "men" && topSlug === "dresses") continue;
      if (isCategoryDisabled(topEntity, gender)) continue;

      paths.add(`/catalog/${gender}/${topSlug}`);

      const subsForGender = filterSubCategories(top.subCategories, gender);
      for (const sub of subsForGender) {
        const subNameLower = sub.name.toLowerCase();
        const subEntity = categories.find(
          (c) => c.level === "sub_category" && c.id === sub.id,
        );
        if (!subEntity || isCategoryDisabled(subEntity, gender)) continue;

        paths.add(`/catalog/${gender}/${topSlug}/${subNameLower}`);
      }
    }
  }

  return [...paths].sort();
}
