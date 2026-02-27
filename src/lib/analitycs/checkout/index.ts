import { common_OrderFull, common_OrderItem } from "@/api/proto-http/frontend";

import {
  AnalyticsItem,
  calculateTotalValue,
  EcommerceEvent,
  pushToDataLayer,
} from "../utils";

export function mapItemsToAnalyticsItems(
  item: common_OrderItem,
  quantity: number,
  topCategory: string,
  subCategory: string,
): AnalyticsItem {
  const originalPrice = parseFloat(item.productPrice || "0");
  const salePercentage = parseFloat(item.productSalePercentage || "0");

  return {
    item_id: item.sku || "",
    item_name: item.translations?.[0]?.name || "",
    item_brand: item.productBrand || "",
    item_category: topCategory || "",
    item_category2: subCategory || "",
    item_variant: item.orderItem?.productId?.toString() || "",
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
): void {
  if (!items || !items?.length) return;

  const event: EcommerceEvent = {
    event: "begin_checkout",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(items),
      items: items.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
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
): void {
  if (!items || !items?.length) return;

  const event: EcommerceEvent = {
    event: "add_shipping_info",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(items),
      shipping_tier: shippingCarrier,
      items: items.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
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
): void {
  if (!items || !items?.length) return;

  const event: EcommerceEvent = {
    event: "add_payment_info",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(items),
      payment_type: paymentMethod,
      items: items.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
      ),
    },
  };

  pushToDataLayer(event);
}

export function sendPurchaseEvent(
  items: common_OrderItem[],
  transactionId: string,
  topCategory: string,
  subCategory: string,
  currency: string = "EUR",
): void {
  if (!items || !items?.length) return;

  const event: EcommerceEvent = {
    event: "purchase",
    ecommerce: {
      currency: currency.toUpperCase(),
      value: calculateTotalValue(items),
      transaction_id: transactionId,
      items: items.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
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
      items: orderData.orderItems?.map((item) =>
        mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
      ),
    },
  };

  pushToDataLayer(event);
}
