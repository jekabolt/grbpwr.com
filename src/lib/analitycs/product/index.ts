import {
  StorefrontColorway,
  StorefrontVariant,
} from "@/api/proto-http/frontend";

import { AnalyticsItem, EcommerceEvent, pushToDataLayer } from "../utils";

// R3: view/list events before a size is chosen use the first available variant in
// canonical ordinal order (PublicSize.sku_ord), so item_id is always a real variant
// SKU. Only ACTIVE colourways are served publicly; a sold-out variant is skipped.
function firstAvailableVariant(
  colorway: StorefrontColorway | undefined,
): StorefrontVariant | undefined {
  const available = (colorway?.variants || []).filter((v) => !v.soldOut);
  const pool = available.length ? available : colorway?.variants || [];
  return [...pool].sort(
    (a, b) => (a.size?.skuOrd || 0) - (b.size?.skuOrd || 0),
  )[0];
}

export function mapItemsToDataLayer(
  product: StorefrontColorway,
  quantity: number,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
  variant?: StorefrontVariant,
): AnalyticsItem {
  const currencyKey = selectedCurrency || "EUR";
  const display = product.display;
  const price =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];
  const priceValue = parseFloat(price?.price?.value || "0");
  const salePercentage = parseFloat(display?.salePercentage?.value || "0");
  const discount = (priceValue * salePercentage) / 100;
  const salePrice = priceValue - discount;
  const chosen = variant ?? firstAvailableVariant(product);

  return {
    // R3 identity: item_group_id = base SKU (colourway); item_id = a variant SKU.
    item_id: chosen?.variantSku || product.baseSku || "",
    item_group_id: product.baseSku || "",
    item_name: display?.translations?.[0]?.name || "",
    item_brand: display?.brand || "",
    item_category: topCategory || "",
    item_category2: subCategory || "",
    // R3: item_variant = the public size code (StorefrontVariant.size.code).
    item_variant: chosen?.size?.code || "",
    discount: discount > 0 ? discount : 0,
    // Net (post-sale) unit price: GA4 item revenue is price × quantity and ignores
    // the `discount` field, so a pre-sale price here would inflate revenue.
    price: salePrice > 0 ? salePrice : priceValue || 0,
    quantity: quantity || 1,
  };
}

export function sendViewItemListEvent(
  products: StorefrontColorway[],
  listName: string,
  listId: string,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
) {
  if (!products?.length || !listName || !listId) return;

  const currencyKey = selectedCurrency || "EUR";
  const event: EcommerceEvent = {
    event: "view_item_list",
    ecommerce: {
      currency: currencyKey.toUpperCase(),
      item_list_id: listId,
      item_list_name: listName,
      items: products.map((p) =>
        mapItemsToDataLayer(p, 1, topCategory, subCategory, selectedCurrency),
      ),
    },
  };

  pushToDataLayer(event);
}

export function sendSelectItemEvent(
  product: StorefrontColorway,
  listName: string,
  listId: string,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
) {
  if (!product || !listName || !listId) return;

  const currencyKey = selectedCurrency || "EUR";
  const event: EcommerceEvent = {
    event: "select_item",
    ecommerce: {
      currency: currencyKey.toUpperCase(),
      item_list_id: listId,
      item_list_name: listName,
      items: [
        mapItemsToDataLayer(
          product,
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

export function sendViewItemEvent(
  product: StorefrontColorway,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
) {
  if (!product || !product.baseSku) return;

  const currencyKey = selectedCurrency || "EUR";
  const mappedItem = mapItemsToDataLayer(
    product,
    1,
    topCategory,
    subCategory,
    selectedCurrency,
    firstAvailableVariant(product),
  );

  const event: EcommerceEvent = {
    event: "view_item",
    ecommerce: {
      currency: currencyKey.toUpperCase(),
      value: mappedItem.price,
      items: [mappedItem],
    },
  };

  pushToDataLayer(event);
}
