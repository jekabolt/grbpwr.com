import type { common_FilterConditions, common_Product } from "@/api/proto-http/frontend";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { routing } from "@/i18n/routing";
import { serviceClient } from "@/lib/api";

import { CANONICAL_COUNTRY_BY_LOCALE, SITEMAP_PUBLIC_BASE_URL } from "./build-entries";
import type { SitemapUrlEntry } from "./serialize-xml";

const SITEMAP_PRODUCT_PAGE_SIZE = 200;

const productListFilters: common_FilterConditions = {
  from: undefined,
  to: undefined,
  currency: "EUR",
  onSale: undefined,
  gender: undefined,
  color: undefined,
  topCategoryIds: undefined,
  subCategoryIds: undefined,
  typeIds: undefined,
  sizesIds: undefined,
  preorder: undefined,
  byTag: undefined,
  collections: undefined,
  seasons: undefined,
};

function productPathFromSlug(slug: string | undefined): string | null {
  if (!slug || !slug.startsWith("/")) return null;
  const i = slug.indexOf("/product/");
  if (i === -1) return null;
  return slug.slice(i);
}

function isProductIndexable(product: common_Product): boolean {
  return product.productDisplay?.productBody?.productBodyInsert?.hidden !== true;
}

function primaryImageLoc(product: common_Product): string | undefined {
  const media = product.productDisplay?.thumbnail?.media;
  const url =
    media?.compressed?.mediaUrl ||
    media?.fullSize?.mediaUrl ||
    media?.thumbnail?.mediaUrl;
  return url?.trim() || undefined;
}

function productNameForLocale(product: common_Product, locale: string): string {
  const languageId = LANGUAGE_CODE_TO_ID[locale];
  const translations = product.productDisplay?.productBody?.translations;
  const hit = translations?.find((t) => t.languageId === languageId);
  return (hit?.name || translations?.[0]?.name || product.sku || "").trim();
}

export async function buildProductSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const entries: SitemapUrlEntry[] = [];
  let offset = 0;

  for (;;) {
    const { products, total } = await serviceClient.GetProductsPaged({
      limit: SITEMAP_PRODUCT_PAGE_SIZE,
      offset,
      sortFactors: ["SORT_FACTOR_UPDATED_AT"],
      orderFactor: "ORDER_FACTOR_DESC",
      filterConditions: productListFilters,
    });

    const batch = products ?? [];

    for (const p of batch) {
      if (!isProductIndexable(p)) continue;
      const productPath = productPathFromSlug(p.slug);
      if (!productPath) continue;

      const imageLoc = primaryImageLoc(p);
      const lastMod = p.updatedAt ? new Date(p.updatedAt) : new Date();

      for (const locale of routing.locales) {
        const country = CANONICAL_COUNTRY_BY_LOCALE[locale];
        const urlPath = `/${country}/${locale}${productPath}`;
        const name = productNameForLocale(p, locale);
        const sku = (p.sku || "").trim();
        const title = sku && name ? `${sku} | ${name}` : name || sku || "product";

        const images =
          imageLoc != null
            ? [{ loc: imageLoc, title, caption: sku || undefined }]
            : undefined;

        entries.push({
          url: `${SITEMAP_PUBLIC_BASE_URL}${urlPath}`,
          lastModified: lastMod,
          changeFrequency: "daily",
          priority: 0.65,
          images,
        });
      }
    }

    offset += batch.length;
    const t = total ?? 0;
    if (offset >= t || batch.length === 0) break;
  }

  return entries;
}
