import {
  StorefrontColorway,
  StorefrontVariant,
} from "@/api/proto-http/frontend";

import { mapItemsToDataLayer } from "../product";
import { EcommerceEvent, pushToDataLayer } from "../utils";

export function sendAddToCartEvent(
  item: StorefrontColorway,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
  variant?: StorefrontVariant,
) {
  if (!item || !item.baseSku) return;

  const currencyKey = selectedCurrency || "EUR";
  // Reuse the mapped item so the event `value` matches the item-level `price` GA4
  // uses for revenue. When the added variant is known, item_id is its variant SKU.
  const mappedItem = mapItemsToDataLayer(
    item,
    1,
    topCategory,
    subCategory,
    selectedCurrency,
    variant,
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
