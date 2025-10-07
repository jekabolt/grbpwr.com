import { common_ProductFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculatePriceWithSale } from "@/lib/utils";

export function useProductPricing({
  product,
}: {
  product: common_ProductFull;
}) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;
  const salePercentage = productBody?.salePercentage?.value || "0";
  const currency = currencySymbols[selectedCurrency];

  const isSaleApplied = salePercentage !== "0";
  const price = `${currency} ${convertPrice(productBody?.price?.value || "0")}`;
  const priceMinusSale = `${price} - ${salePercentage}% = `;
  const priceWithSale = `${currency} ${calculatePriceWithSale(
    productBody?.price?.value || "0",
    salePercentage,
  )}`;

  const priceNumber = parseFloat(
    convertPrice(productBody?.price?.value || "0"),
  );

  return {
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
    priceNumber,
  };
}
