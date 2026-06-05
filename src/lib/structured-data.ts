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

  const offers = (p.prices ?? [])
    .filter((pr) => pr?.price?.value && pr.currency)
    .map((pr) => ({
      "@type": "Offer",
      priceCurrency: pr.currency,
      price: pr.price!.value,
      availability,
      ...(url ? { url } : {}),
      hasMerchantReturnPolicy: RETURN_POLICY,
      shippingDetails: SHIPPING_DETAILS,
    }));

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
    ...(offers.length ? { offers } : {}),
  };
}
