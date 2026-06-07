import type { common_ProductFull } from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

// schema.org Product/Offer JSON-LD for product pages. Gives search engines (and
// AI agents) machine-readable price/availability/brand — the "commerce signal"
// the site was missing. Read-only, derived from the product the page already
// fetched; no extra requests.

const SITE = "https://grbpwr.com";

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

/**
 * The single offer (currency + price value) to advertise for a locale.
 * Products carry one base price value; the storefront reuses that value and only
 * swaps the currency per country, so we surface that value under the locale's
 * currency — preferring an exact currency match if the backend ever supplies one.
 * Returns null when the product has no usable price.
 */
export function productOfferForLocale(
  productFull: common_ProductFull | undefined,
  locale: string,
): { currency: string; price: string } | null {
  const prices = productFull?.product?.prices ?? [];
  const currency = currencyForLocale(locale);
  const match =
    prices.find(
      (pr) => pr?.currency?.toUpperCase() === currency && pr.price?.value,
    ) ?? prices.find((pr) => pr?.price?.value);
  const price = match?.price?.value;
  return price ? { currency, price } : null;
}

// Uppercase ISO codes of every country the storefront ships to (deduped).
const SHIPPING_COUNTRIES = Array.from(
  new Set(
    Object.values(COUNTRIES_BY_REGION)
      .flat()
      .map((c) => c.countryCode.toUpperCase()),
  ),
);

// Return policy mirrors /legal/return-exchange: 14 calendar days, free returns
// via a prepaid label (ReturnByMail). Kept in sync with that page.
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: SHIPPING_COUNTRIES,
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
};

// Shipping: real destinations + delivery window (5–7 business days, per
// /legal/terms-of-sale). shippingRate is intentionally omitted — the rate is
// region-dependent and shown at checkout, so any fixed value would be inaccurate
// (authoritative rates belong in Google Merchant Center).
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: SHIPPING_COUNTRIES,
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 5,
      maxValue: 7,
      unitCode: "DAY",
    },
  },
};

export function productJsonLd(
  productFull: common_ProductFull | undefined,
  locale: string,
): Record<string, unknown> | null {
  const p = productFull?.product;
  if (!p) return null;

  const langId = LANGUAGE_CODE_TO_ID[locale];
  const translations = p.productDisplay?.productBody?.translations;
  const t =
    translations?.find((x) => x.languageId === langId) ?? translations?.[0];
  const name = (t?.name || p.sku || "").trim();
  if (!name) return null;

  const country = COUNTRY_BY_LOCALE[locale] ?? "gb";
  const slug =
    p.slug && p.slug.includes("/product/")
      ? p.slug.slice(p.slug.indexOf("/product/"))
      : null;
  const url = slug ? `${SITE}/${country}/${locale}${slug}` : undefined;

  const image = (productFull?.media ?? [])
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

  const offer = productOfferForLocale(productFull, locale);
  const offers = offer
    ? [
        {
          "@type": "Offer",
          priceCurrency: offer.currency,
          price: offer.price,
          availability,
          ...(url ? { url } : {}),
          hasMerchantReturnPolicy: RETURN_POLICY,
          shippingDetails: SHIPPING_DETAILS,
        },
      ]
    : [];

  const description = (t?.description || "").trim();
  const color = p.productDisplay?.productBody?.productBodyInsert?.color?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    ...(image.length ? { image } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    brand: { "@type": "Brand", name: "GRBPWR" },
    ...(color ? { color } : {}),
    ...(url ? { url } : {}),
    ...(p.createdAt ? { datePublished: p.createdAt } : {}),
    ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
    ...(offers.length ? { offers } : {}),
  };
}

// Organization + WebSite JSON-LD for the homepage. Gives the homepage a content
// freshness signal (dateModified, derived from the freshest product) and feeds
// Google's brand knowledge panel / sitelinks search box.
export function siteJsonLd(dateModified?: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "GRBPWR",
        url: SITE,
        logo: `${SITE}/app-logo.webp`,
        sameAs: ["https://www.instagram.com/grb.pwr/"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "GRBPWR",
        publisher: { "@id": `${SITE}/#organization` },
        inLanguage: "en",
        ...(dateModified ? { dateModified } : {}),
      },
    ],
  };
}
