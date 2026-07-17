import { common_ColorwayFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

export function useProductPricing({
  product,
}: {
  product: common_ColorwayFull;
}) {
  const { currentCountry } = useTranslationsStore((s) => s);
  const productBody =
    product.colorway?.display?.productBody?.productBodyInsert;
  const salePercentage = productBody?.salePercentage?.value || "0";

  const currencyKey = currentCountry.currencyKey || "EUR";
  const productPrice =
    product.colorway?.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.colorway?.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const isSaleApplied = salePercentage !== "0";

  const price = formatPrice(priceValue, currencyKey, currencySymbol);

  const priceWithSaleValue =
    (parseFloat(priceValue) * (100 - parseInt(salePercentage || "0"))) / 100;
  const priceWithSale = formatPrice(priceWithSaleValue, currencyKey, currencySymbol);

  const priceMinusSale = `${price} - ${salePercentage}% = `;

  return {
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
  };
}
