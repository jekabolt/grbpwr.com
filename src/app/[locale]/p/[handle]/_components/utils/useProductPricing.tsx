import { StorefrontColorway } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

export function useProductPricing({
  product,
}: {
  product: StorefrontColorway;
}) {
  const { currentCountry } = useTranslationsStore((s) => s);
  // StorefrontColorwayDisplay.sale_percentage — 0/absent means no discount (order
  // validation stays authoritative for the charged amount).
  const salePercentage = product.display?.salePercentage?.value || "0";

  const currencyKey = currentCountry.currencyKey || "EUR";
  const productPrice =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const isSaleApplied = salePercentage !== "0" && parseFloat(salePercentage) > 0;

  const price = formatPrice(priceValue, currencyKey, currencySymbol);

  const priceWithSaleValue =
    (parseFloat(priceValue) * (100 - parseInt(salePercentage || "0"))) / 100;
  const priceWithSale = formatPrice(
    priceWithSaleValue,
    currencyKey,
    currencySymbol,
  );

  const priceMinusSale = `${price} - ${salePercentage}% = `;

  return {
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
  };
}
