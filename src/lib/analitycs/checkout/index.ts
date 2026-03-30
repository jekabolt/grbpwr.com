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
  const salePercentage = parseFloat(item.productSalePercentage || "0");
  const sizeId = item.orderItem?.sizeId;
  const sizeName = sizeId != null && sizeMap ? (sizeMap[sizeId] || "") : "";

  return {
    item_id: item.sku || "",
    item_name: item.translations?.[0]?.name || "",
    item_brand: item.productBrand || "",
    item_category: topCategory || "",
    item_category2: subCategory || "",
    item_variant: sizeName,
    discount: (originalPrice * salePercentage) / 100,
    price: originalPrice,
    quantity: quantity || 1,
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
  if (!transactionId || transactionId === "false" || transactionId === "undefined") {
    console.error("sendPurchaseEvent: Invalid transaction_id", transactionId);
    return;
  }

  const event: EcommerceEvent = {
    event: "purchase",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: options?.totalValue ?? calculateTotalValue(validItems),
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

  const event: EcommerceEvent = {
    event: "refund",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(orderData.orderItems || []),
      transaction_id: orderData.order.uuid,
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
