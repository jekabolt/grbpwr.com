// grbpwr pack: the shipping and return promises of grbpwr's own legal pages,
// as Offer markup. No other shop may emit them (its terms are its own).
import { COUNTRIES_BY_REGION } from "@/constants";

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

/** Spread into an schema.org Offer of a grbpwr product. */
export const GRBPWR_OFFER_POLICY = {
  hasMerchantReturnPolicy: RETURN_POLICY,
  shippingDetails: SHIPPING_DETAILS,
};
