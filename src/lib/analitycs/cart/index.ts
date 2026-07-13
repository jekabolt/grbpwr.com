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
  // Reuse the mapped item so the event `value` is the net (post-sale) price,
  // consistent with the item-level `price` GA4 uses for revenue.
  const mappedItem = mapItemsToDataLayer(
    item.product,
    1,
    topCategory,
    subCategory,
    selectedCurrency,
  );

  const event: EcommerceEvent = {
    event: "add_to_cart",
    ecommerce: {
      currency: currencyKey.toUpperCase(),
      value: mappedItem.price * mappedItem.quantity,
      items: [mappedItem],
    },
  };

  pushToDataLayer(event);
}
