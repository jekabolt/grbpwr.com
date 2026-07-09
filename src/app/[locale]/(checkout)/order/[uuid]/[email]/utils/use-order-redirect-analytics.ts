import { useEffect, useRef, type RefObject } from "react";
import type {
  common_Category,
  common_OrderFull,
} from "@/api/proto-http/frontend";

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
  const redirectCleanupDoneRef = useRef(false);
  // undefined = not yet read; string|null = the value captured before we scrub
  // it from the URL, so the purchase can still fire on a later render.
  const redirectStatusRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    ensureGtag();

    // Read redirect_status once and remember it — the cleanup below rewrites the
    // URL, so we can't re-read it when orderData arrives on a later render.
    if (redirectStatusRef.current === undefined) {
      redirectStatusRef.current = new URLSearchParams(
        window.location.search,
      ).get("redirect_status");
    }
    if (redirectStatusRef.current !== "succeeded") return;

    // One-time redirect cleanup, independent of when the order object loads.
    if (!redirectCleanupDoneRef.current) {
      redirectCleanupDoneRef.current = true;
      window.history.replaceState({}, "", window.location.pathname);
      clearCart();
      clearIdempotencyKey();
      sessionStorage.removeItem("pending_stripe_order");
    }

    // Purchase fires exactly once, and only after the order object is populated
    // — never with a half-loaded (falsy) payload.
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
  }, [clearCart, orderData, dictionaryCategories, sizeMapRef]);
}
