import {
  common_Colorway,
  common_ColorwayFull,
  common_Variant,
} from "@/api/proto-http/frontend";

import { AnalyticsItem, EcommerceEvent, pushToDataLayer } from "../utils";

// R3: view events before a size is chosen use the first available variant in
// canonical ordinal order. The final StorefrontVariant carries size.sku_ord; the
// intermediate Variant only exposes size_id, so we stand in with size_id ordering
// and ACTIVE status. TODO(final-bump): order by PublicSize.sku_ord.
function firstAvailableVariant(
  full: common_ColorwayFull | undefined,
): common_Variant | undefined {
  const active = (full?.variants || []).filter(
    (v) => v.status === "VARIANT_LIFECYCLE_STATUS_ACTIVE",
  );
  return [...active].sort((a, b) => (a.sizeId || 0) - (b.sizeId || 0))[0];
}

export function mapItemsToDataLayer(
  product: common_Colorway,
  quantity: number,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
  variant?: common_Variant,
): AnalyticsItem {
  const currencyKey = selectedCurrency || "EUR";
  const productBody = product.display?.productBody?.productBodyInsert;
  const price =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];
  const priceValue = parseFloat(price?.price?.value || "0");
  const salePercentage = parseFloat(productBody?.salePercentage?.value || "0");
  const discount = (priceValue * salePercentage) / 100;
  const salePrice = priceValue - discount;

  return {
    // R3 identity: item_group_id = base SKU (colourway); item_id = a variant SKU.
    // In list/grid contexts the intermediate contract exposes only the colourway
    // (no variants), so item_id falls back to the base SKU.
    // TODO(final-bump): item_id is always the variant SKU (StorefrontVariant).
    item_id: variant?.variantSku || product.baseSku || "",
    item_group_id: product.baseSku || "",
    item_name: product.display?.productBody?.translations?.[0]?.name || "",
    item_brand: productBody?.brand || "",
    item_category: topCategory || "",
    item_category2: subCategory || "",
    // R3: item_variant = public size code. The intermediate variant carries only
    // size_id, not the public code, so this stays empty for now.
    // TODO(final-bump): StorefrontVariant.size.code.
    item_variant: "",
    discount: discount > 0 ? discount : 0,
    // Net (post-sale) unit price: GA4 item revenue is price × quantity and
    // ignores the `discount` field, so a pre-sale price here inflates revenue.
    price: salePrice > 0 ? salePrice : priceValue || 0,
    quantity: quantity || 1,
  };
}

export function sendViewItemListEvent(
  products: common_Colorway[],
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
  product: common_Colorway,
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
  product: common_ColorwayFull,
  topCategory: string,
  subCategory: string,
  selectedCurrency: string,
) {
  if (!product || !product?.colorway) return;

  const currencyKey = selectedCurrency || "EUR";
  // Reuse the mapped item so the event `value` matches the item's net price
  // (post-sale) instead of the pre-sale list price.
  const mappedItem = mapItemsToDataLayer(
    product.colorway,
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
