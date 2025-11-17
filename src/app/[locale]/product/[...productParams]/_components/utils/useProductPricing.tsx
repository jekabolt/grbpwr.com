import { common_ProductFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";

export function useProductPricing({
  product,
}: {
  product: common_ProductFull;
}) {
  const { selectedCurrency } = useCurrency((state) => state);
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;
  const salePercentage = productBody?.salePercentage?.value || "0";

  const currencyKey = selectedCurrency || "EUR";
  const productPrice =
    product.product?.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.product?.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const isSaleApplied = salePercentage !== "0";

  const formattedPrice = parseFloat(priceValue).toFixed(2);
  const price = `${currencySymbol} ${formattedPrice}`;

  const priceWithSaleValue =
    (parseFloat(priceValue) * (100 - parseInt(salePercentage || "0"))) / 100;
  const formattedPriceWithSale = priceWithSaleValue.toFixed(2);
  const priceWithSale = `${currencySymbol} ${formattedPriceWithSale}`;

  const priceMinusSale = `${price} - ${salePercentage}% = `;

  return {
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
  };
}
