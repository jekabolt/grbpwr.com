export {
  buildCatalogSitemapEntries,
  buildPagesSitemapEntries,
  CANONICAL_COUNTRY_BY_LOCALE,
  SITEMAP_CHILD_DOCUMENT_RELATIVE,
  SITEMAP_PUBLIC_BASE_URL,
  SITEMAP_REVALIDATE_SECONDS
} from "./build-entries";
export { buildProductSitemapEntries } from "./build-product-entries";
export {
  CATALOG_SITEMAP_HUB_PATHS,
  collectCatalogSitemapPaths,
  PAGES_SITEMAP_PATHS
} from "./catalog-paths";
export { serializeSitemapIndex, serializeUrlset } from "./serialize-xml";
export type { SitemapUrlEntry } from "./serialize-xml";

