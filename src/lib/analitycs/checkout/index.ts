import { common_OrderFull, common_OrderItem } from "@/api/proto-http/frontend";

import {
  AnalyticsItem,
  calculateTotalValue,
  EcommerceEvent,
  pushToDataLayer,
  SizeMap,
} from "../utils";

export function mapItemsToAnalyticsItems(
  item: common_OrderItem,
  quantity: number,
  topCategory: string,
  subCategory: string,
  sizeMap?: SizeMap,
): AnalyticsItem {
  const originalPrice = parseFloat(item.productPrice || "0");
  const salePrice =
    parseFloat(item.productPriceWithSale || "0") || originalPrice;
  const discount = Math.max(0, originalPrice - salePrice);
  const sizeId = item.orderItem?.sizeId;
  const sizeName = sizeId != null && sizeMap ? sizeMap[sizeId] || "" : "";

  return {
    // TODO(final-bump): item_id → variant_sku_snapshot, item_group_id →
    // base_sku_snapshot once the order projection carries variant identity (R2/R3).
    item_id: item.sku || "",
    item_group_id: item.sku || "",
    item_name: item.translations?.[0]?.name || "",
    item_brand: item.productBrand || "",
    item_category: topCategory || "",
    item_category2: subCategory || "",
    item_variant: sizeName,
    discount,
    // GA4 item revenue is `price × quantity` and does NOT subtract the `discount`
    // field, so `price` must be the net (post-sale) unit price or sale orders
    // report inflated item revenue that no longer reconciles with the order
    // total. `discount` stays as the informational per-unit saving.
    price: salePrice,
    // Prefer the line item's real quantity so the item-level totals reconcile
    // with the event `value` (which already multiplies by quantity). The passed
    // `quantity` stays as a fallback for callers without an order-item context.
    quantity: item.orderItem?.quantity || quantity || 1,
  };
}

export function sendBeginCheckoutEvent(
  items: common_OrderItem[],
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
  sizeMap?: SizeMap,
): void {
  const validItems = items.filter(Boolean);
  if (!validItems.length) return;

  const event: EcommerceEvent = {
    event: "begin_checkout",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(validItems),
      items: validItems.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory, sizeMap),
      ),
    },
  };

  pushToDataLayer(event);
}

export function sendAddShippingInfoEvent(
  items: common_OrderItem[],
  shippingCarrier: string,
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
  sizeMap?: SizeMap,
): void {
  const validItems = items.filter(Boolean);
  if (!validItems.length) return;

  const event: EcommerceEvent = {
    event: "add_shipping_info",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(validItems),
      shipping_tier: shippingCarrier,
      items: validItems.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory, sizeMap),
      ),
    },
  };

  pushToDataLayer(event);
}

export function sendAddPaymentInfoEvent(
  items: common_OrderItem[],
  paymentMethod: string,
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
  sizeMap?: SizeMap,
): void {
  const validItems = items.filter(Boolean);
  if (!validItems.length) return;

  const event: EcommerceEvent = {
    event: "add_payment_info",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(validItems),
      payment_type: paymentMethod,
      items: validItems.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory, sizeMap),
      ),
    },
  };

  pushToDataLayer(event);
}

export interface PurchaseOptions {
  coupon?: string;
  shipping?: number;
  tax?: number;
  totalValue?: number;
}

export function sendPurchaseEvent(
  items: common_OrderItem[],
  transactionId: string,
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
  sizeMap?: SizeMap,
  options?: PurchaseOptions,
): void {
  const validItems = items.filter(Boolean);
  if (!validItems.length) return;
  if (
    !transactionId ||
    transactionId === "false" ||
    transactionId === "undefined"
  ) {
    console.error("sendPurchaseEvent: Invalid transaction_id", transactionId);
    return;
  }

  // Reject falsy/placeholder money fields so a half-populated order can never
  // emit a `value=0 / currency="0"` purchase that GA4 would dedupe against the
  // real one and zero out its revenue.
  const value = options?.totalValue ?? calculateTotalValue(validItems);
  if (!Number.isFinite(value) || value <= 0) {
    console.error("sendPurchaseEvent: Invalid value", value);
    return;
  }
  const normalizedCurrency = currency?.toUpperCase();
  if (!normalizedCurrency || !/^[A-Z]{3}$/.test(normalizedCurrency)) {
    console.error("sendPurchaseEvent: Invalid currency", currency);
    return;
  }

  const event: EcommerceEvent = {
    event: "purchase",
    ecommerce: {
      currency: normalizedCurrency,
      value,
      transaction_id: transactionId,
      ...(options?.coupon && { coupon: options.coupon }),
      ...(options?.shipping != null && { shipping: options.shipping }),
      ...(options?.tax != null && { tax: options.tax }),
      items: validItems.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory, sizeMap),
      ),
    },
  };

  pushToDataLayer(event);
}

export function sendRefundEvent(
  orderData: common_OrderFull,
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
  sizeMap?: SizeMap,
  returnReason?: string,
) {
  if (!orderData || !orderData.order) return;

  const transactionId = orderData.order.uuid;
  if (!transactionId) return;

  // Mirror the purchase money exactly — same transaction_id, the order's own
  // currency (not a hardcoded EUR default), and the settled total — so a full
  // cancellation nets out against the purchase in GA4 instead of leaving a
  // residual from summing pre-sale item prices in the wrong currency. Prefer the
  // backend-computed refunded amount when it is already set (e.g. partial).
  const normalizedCurrency = (
    orderData.order.currency ||
    currency ||
    "EUR"
  ).toUpperCase();
  const refundedAmount = parseFloat(
    orderData.order.refundedAmount?.value || "0",
  );
  const value =
    refundedAmount > 0
      ? refundedAmount
      : parseFloat(orderData.order.totalPrice?.value || "0");

  const event: EcommerceEvent = {
    event: "refund",
    ecommerce: {
      currency: normalizedCurrency,
      value,
      transaction_id: transactionId,
      coupon: orderData.promoCode?.promoCodeInsert?.code || "not set",
      shipping: parseFloat(orderData.shipment?.cost?.value || "0") || 0,
      ...(returnReason && { return_reason: returnReason }),
      items: orderData.orderItems?.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory, sizeMap),
      ),
    },
  };

  pushToDataLayer(event);
}
