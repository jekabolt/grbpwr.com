import { common_ProductFull } from "@/api/proto-http/frontend";

import { mapItemsToDataLayer } from "../product";
import { EcommerceEvent, pushToDataLayer } from "../utils";

export function sendAddToCartEvent(
  item: common_ProductFull,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
) {
  if (!item || !item.product) return;

  const currencyKey = selectedCurrency || "EUR";
  const price =
    item.product?.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || item.product?.prices?.[0];
  const totalValue = parseFloat(price?.price?.value || "0");

  const event: EcommerceEvent = {
    event: "add_to_cart",
    ecommerce: {
      currency: currencyKey.toUpperCase(),
      value: totalValue,
      items: [
        mapItemsToDataLayer(
          item.product,
          1,
          topCategory,
          subCategory,
          selectedCurrency,
        ),
      ],
    },
  };

  pushToDataLayer(event);
}
