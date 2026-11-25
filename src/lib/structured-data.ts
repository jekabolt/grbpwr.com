import type { StorefrontColorway } from "@/api/proto-http/frontend";
import type { ShopPack } from "@/brands";
import { GRBPWR_PACK } from "@/brands/grbpwr/config";
import { GRBPWR_OFFER_POLICY } from "@/brands/grbpwr/structured-data";
import { LANGUAGE_CODE_TO_ID } from "@/constants";

// schema.org Product/Offer JSON-LD for product pages. Gives search engines (and
// AI agents) machine-readable price/availability/brand — the "commerce signal"
// the site was missing. Read-only, derived from the product the page already
// fetched; no extra requests.

/** Shop on the request host (lekalo-shop): origin + brand name, never hard-coded. */
export type JsonLdSite = {
  origin: string;
  name: string;
  /** Brand as a proper name (falls back to `name`). */
  brandName?: string;
  logoUrl?: string;
  sameAs?: string[];
  /**
   * Shipping / return policy markup is a shop's legal promise: only a pack that
   * carries its own policy (grbpwr) emits it, never another shop.
   */
  pack?: ShopPack;
};

const brandOf = (site: JsonLdSite) => site.brandName ?? site.name;

const COUNTRY_BY_LOCALE: Record<string, string> = {
  en: "gb",
  fr: "fr",
  de: "de",
  it: "it",
  ja: "jp",
  zh: "cn",
  ko: "kr",
};

// Display currency per locale — mirrors the canonical country (COUNTRY_BY_LOCALE)
// and the currency the storefront actually shows. Country variants (e.g. /us/en)
// canonicalise to the locale's canonical country, so a locale-only mapping stays
// consistent with <link rel="canonical">.
const CURRENCY_BY_LOCALE: Record<string, string> = {
  en: "GBP",
  fr: "EUR",
  de: "EUR",
  it: "EUR",
  ja: "JPY",
  zh: "CNY",
  ko: "KRW",
};

/** Canonical display currency code for a locale. */
export function currencyForLocale(locale: string): string {
  return CURRENCY_BY_LOCALE[locale] ?? "GBP";
}

// Serialize a JSON-LD object for inline `<script>` embedding. JSON.stringify
// does NOT escape `<`, `>`, `&`, so a backend- or URL-supplied value containing
// `</script>` (e.g. a product name or a /catalog/<segment> path param) would
// break out of the script element and execute — XSS. Escaping the HTML-
// significant characters neutralizes that (`<` alone is sufficient to prevent
// the `</script>` breakout; `>` and `&` are escaped for good measure).
export function jsonLdHtml(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * The single offer (currency + price value) to advertise for a locale.
 * Products carry one base price value; the storefront reuses that value and only
 * swaps the currency per country, so we surface that value under the locale's
 * currency — preferring an exact currency match if the backend ever supplies one.
 * Returns null when the product has no usable price.
 */
export function productOfferForLocale(
  colorway: StorefrontColorway | undefined,
  locale: string,
): { currency: string; price: string } | null {
  const prices = colorway?.prices ?? [];
  const currency = currencyForLocale(locale);
  const match =
    prices.find(
      (pr) => pr?.currency?.toUpperCase() === currency && pr.price?.value,
    ) ?? prices.find((pr) => pr?.price?.value);
  const price = match?.price?.value;
  return price ? { currency, price } : null;
}

export function productJsonLd(
  site: JsonLdSite,
  colorway: StorefrontColorway | undefined,
  locale: string,
): Record<string, unknown> | null {
  const SITE = site.origin;
  const p = colorway;
  if (!p) return null;

  const langId = LANGUAGE_CODE_TO_ID[locale];
  const translations = p.display?.translations;
  const t =
    translations?.find((x) => x.languageId === langId) ?? translations?.[0];
  const name = (t?.name || p.baseSku || "").trim();
  if (!name) return null;

  const country = COUNTRY_BY_LOCALE[locale] ?? "gb";
  const slug =
    p.slug && p.slug.includes("/p/")
      ? p.slug.slice(p.slug.indexOf("/p/"))
      : null;
  const url = slug ? `${SITE}/${country}/${locale}${slug}` : undefined;

  const image = (p.media ?? [])
    .map(
      (m) =>
        m?.media?.compressed?.mediaUrl ||
        m?.media?.fullSize?.mediaUrl ||
        m?.media?.thumbnail?.mediaUrl,
    )
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u))
    .slice(0, 8);

  const availability = p.soldOut
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";

  const offer = productOfferForLocale(p, locale);
  const offers = offer
    ? [
        {
          "@type": "Offer",
          priceCurrency: offer.currency,
          price: offer.price,
          availability,
          ...(url ? { url } : {}),
          ...(site.pack === GRBPWR_PACK ? GRBPWR_OFFER_POLICY : {}),
        },
      ]
    : [];

  const description = (t?.description || "").trim();
  // The lean projection exposes the colour code only (no resolved dictionary name).
  const color = p.colorCode?.trim();

  const productNode = {
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    ...(image.length ? { image } : {}),
    ...(p.baseSku ? { sku: p.baseSku } : {}),
    brand: { "@type": "Brand", name: brandOf(site) },
    ...(color ? { color } : {}),
    ...(url ? { url } : {}),
    ...(p.display?.updatedAt ? { dateModified: p.display.updatedAt } : {}),
    ...(offers.length ? { offers } : {}),
  };

  // Breadcrumb: {shop} > Catalog > {product}. Helps Google render a breadcrumb
  // trail in product snippets instead of the bare URL.
  const homeUrl = `${SITE}/${country}/${locale}`;
  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: brandOf(site), item: homeUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catalog",
        item: `${homeUrl}/catalog`,
      },
      { "@type": "ListItem", position: 3, name, ...(url ? { item: url } : {}) },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [productNode, breadcrumbNode],
  };
}

// CollectionPage + BreadcrumbList for catalog listings (/catalog and category
// listings). ItemList is intentionally omitted — the catalog loads products
// client-side (infinite scroll), so there's no server-rendered product list to
// enumerate; adding it would require a dedicated server fetch.
export function catalogJsonLd({
  site,
  locale,
  routeParams,
  name,
  description,
}: {
  site: JsonLdSite;
  locale: string;
  routeParams?: string[];
  name: string;
  description?: string;
}): Record<string, unknown> {
  const SITE = site.origin;
  const country = COUNTRY_BY_LOCALE[locale] ?? "gb";
  const homeUrl = `${SITE}/${country}/${locale}`;
  const catalogUrl = `${homeUrl}/catalog`;
  const url = routeParams?.length
    ? `${catalogUrl}/${routeParams.join("/")}`
    : catalogUrl;
  const category = routeParams?.[0];

  const itemListElement = [
    { "@type": "ListItem", position: 1, name: brandOf(site), item: homeUrl },
    { "@type": "ListItem", position: 2, name: "Catalog", item: catalogUrl },
    ...(category
      ? [{ "@type": "ListItem", position: 3, name: category, item: url }]
      : []),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name,
        url,
        ...(description ? { description } : {}),
        isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement,
      },
    ],
  };
}

// Organization + WebSite JSON-LD for the homepage. Gives the homepage a content
// freshness signal (dateModified, derived from the freshest product) and feeds
// Google's brand knowledge panel / sitelinks search box.
export function siteJsonLd(
  site: JsonLdSite,
  dateModified?: string,
): Record<string, unknown> {
  const SITE = site.origin;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: brandOf(site),
        url: SITE,
        ...(site.logoUrl ? { logo: site.logoUrl } : {}),
        ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: brandOf(site),
        publisher: { "@id": `${SITE}/#organization` },
        inLanguage: "en",
        ...(dateModified ? { dateModified } : {}),
      },
    ],
  };
}
