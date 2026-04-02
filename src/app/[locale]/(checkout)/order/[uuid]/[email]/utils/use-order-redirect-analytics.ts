import { useEffect, useRef, type RefObject } from "react";
import type { common_Category, common_OrderFull } from "@/api/proto-http/frontend";

import { sendPurchaseEvent } from "@/lib/analitycs/checkout";
import {
  ensureGtag,
  pushUserIdToDataLayer,
  type SizeMap,
} from "@/lib/analitycs/utils";
import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { useCart } from "@/lib/stores/cart/store-provider";

export function useOrderRedirectAnalytics({
  orderData,
  dictionaryCategories,
  sizeMapRef,
}: {
  orderData: common_OrderFull | undefined;
  dictionaryCategories: common_Category[] | undefined;
  sizeMapRef: RefObject<SizeMap>;
}) {
  const { clearCart } = useCart((state) => state);
  const purchaseFiredRef = useRef(false);
  const redirectStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (redirectStatusRef.current !== null) return;

    ensureGtag();

    const params = new URLSearchParams(window.location.search);
    const redirectStatus = params.get("redirect_status");
    redirectStatusRef.current = redirectStatus;

    if (redirectStatus === "succeeded") {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);

      clearCart();
      clearIdempotencyKey();

      if (
        !purchaseFiredRef.current &&
        orderData?.orderItems?.length &&
        orderData.order?.uuid
      ) {
        purchaseFiredRef.current = true;

        const items = orderData.orderItems;
        const topCategoryId =
          items.find((v) => v?.topCategoryId)?.topCategoryId || 0;
        const subCategoryId =
          items.find((v) => v?.subCategoryId)?.subCategoryId || 0;

        const totalPrice = parseFloat(orderData.order.totalPrice?.value || "0");
        const shippingCost = parseFloat(orderData.shipment?.cost?.value || "0");
        const itemsSubtotal = items.reduce((sum, item) => {
          const price = parseFloat(item.productPrice || "0");
          const quantity = item.orderItem?.quantity || 1;
          return sum + price * quantity;
        }, 0);
        const taxAmount = totalPrice - itemsSubtotal - shippingCost;

        sendPurchaseEvent(
          items,
          orderData.order.uuid,
          getTopCategoryName(dictionaryCategories || [], topCategoryId) || "",
          getSubCategoryName(dictionaryCategories || [], subCategoryId) || "",
          orderData.order.currency?.toUpperCase() || "EUR",
          sizeMapRef.current,
          {
            coupon: orderData.promoCode?.promoCodeInsert?.code || undefined,
            shipping: shippingCost || undefined,
            tax: taxAmount > 0 ? taxAmount : undefined,
            totalValue: totalPrice,
          },
        );

        const buyerEmail = orderData.buyer?.buyerInsert?.email;
        if (buyerEmail) {
          void pushUserIdToDataLayer(buyerEmail);
        }
      }
    }
  }, [clearCart, orderData, dictionaryCategories, sizeMapRef]);
}
