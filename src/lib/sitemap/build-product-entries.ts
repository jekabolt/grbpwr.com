import type { common_FilterConditions, common_Colorway } from "@/api/proto-http/frontend";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { routing } from "@/i18n/routing";
import { serviceClient } from "@/lib/api";

import { hreflangAlternates, localizedSitemapUrl } from "./build-entries";
import type { SitemapUrlEntry } from "./serialize-xml";

const SITEMAP_PRODUCT_PAGE_SIZE = 200;

const productListFilters: common_FilterConditions = {
  from: undefined,
  to: undefined,
  currency: "EUR",
  onSale: undefined,
  gender: undefined,
  topCategoryIds: undefined,
  subCategoryIds: undefined,
  excludeTopCategoryIds: undefined,
  typeIds: undefined,
  sizesIds: undefined,
  preorder: undefined,
  byTag: undefined,
  collections: undefined,
  seasons: undefined,
  colorCodes: undefined,
};

function productPathFromSlug(slug: string | undefined): string | null {
  if (!slug || !slug.startsWith("/")) return null;
  const i = slug.indexOf("/p/");
  if (i === -1) return null;
  return slug.slice(i);
}

function isProductIndexable(product: common_Colorway): boolean {
  return product.display?.productBody?.productBodyInsert?.hidden !== true;
}

function primaryImageLoc(product: common_Colorway): string | undefined {
  const media = product.display?.thumbnail?.media;
  const url =
    media?.compressed?.mediaUrl ||
    media?.fullSize?.mediaUrl ||
    media?.thumbnail?.mediaUrl;
  return url?.trim() || undefined;
}

function productNameForLocale(product: common_Colorway, locale: string): string {
  const languageId = LANGUAGE_CODE_TO_ID[locale];
  const translations = product.display?.productBody?.translations;
  const hit = translations?.find((t) => t.languageId === languageId);
  return (hit?.name || translations?.[0]?.name || product.baseSku || "").trim();
}

export async function buildProductSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const entries: SitemapUrlEntry[] = [];
  let offset = 0;

  for (;;) {
    const { products, total } = await serviceClient.GetColorwaysPaged({
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
      const alternates = hreflangAlternates(productPath);

      for (const locale of routing.locales) {
        const name = productNameForLocale(p, locale);
        const sku = (p.baseSku || "").trim();
        const title = sku && name ? `${sku} | ${name}` : name || sku || "product";

        const images =
          imageLoc != null
            ? [{ loc: imageLoc, title, caption: sku || undefined }]
            : undefined;

        entries.push({
          url: localizedSitemapUrl(locale, productPath),
          lastModified: lastMod,
          changeFrequency: "daily",
          priority: 0.65,
          images,
          alternates,
        });
      }
    }

    offset += batch.length;
    const t = total ?? 0;
    if (offset >= t || batch.length === 0) break;
  }

  return entries;
}
