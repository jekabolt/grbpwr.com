import { StorefrontColorway } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

// The lean storefront projection carries no per-colourway sale percentage (R3):
// sale pricing is authoritative at order validation, not the product read path.
// So the PDP price shows the list price and never a client-side sale badge.
export function useProductPricing({
  product,
}: {
  product: StorefrontColorway;
}) {
  const { currentCountry } = useTranslationsStore((s) => s);

  const currencyKey = currentCountry.currencyKey || "EUR";
  const productPrice =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const price = formatPrice(priceValue, currencyKey, currencySymbol);

  return {
    isSaleApplied: false,
    price,
    priceMinusSale: "",
    priceWithSale: price,
  };
}
