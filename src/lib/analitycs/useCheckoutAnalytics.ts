import { useContext, useEffect, useMemo, useRef } from "react";
import { common_OrderItem } from "@/api/proto-http/frontend";
import { paymentMethodNamesMap } from "@/constants";

import { useDataContext } from "@/components/contexts/DataContext";

import { getSubCategoryName, getTopCategoryName } from "../categories-map";
import { CartStoreContext, useCart } from "../stores/cart/store-provider";
import { useTranslationsStore } from "../stores/translations/store-provider";
import {
  sendAddPaymentInfoEvent,
  sendAddShippingInfoEvent,
  sendBeginCheckoutEvent,
} from "./checkout";
import {
  sendFormErrorEvent,
  sendFormStartEvent,
  sendFormSubmitEvent,
  sendPaymentFailedEvent,
} from "./checkout-custom";
import { refreshGa4ClientIdToStorage, SizeMap } from "./utils";

// Carriers already reported for add_shipping_info. Module-level so it survives
// form remounts (login steps, currency sync) — a carrier the user already saw
// reported doesn't re-fire when they toggle A→B→A, while a genuinely new carrier
// still fires once. Cleared when the cart empties (order placed / drained).
const firedShippingCarriers = new Set<string>();

export function useCheckoutAnalytics() {
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((state) => state);
  const cartStore = useContext(CartStoreContext);
  const currency = currentCountry.currencyKey || "EUR";

  const paymentEventFiredRef = useRef<string | null>(null);

  useEffect(() => {
    refreshGa4ClientIdToStorage();
    if (!cartStore) return;
    return cartStore.subscribe((state) => {
      if (state.products.length === 0) firedShippingCarriers.clear();
    });
  }, [cartStore]);

  const getItems = () => {
    if (!cartStore) return [];
    return cartStore.getState().products.map((v) => v.productData);
  };

  const items = getItems();
  const topCategoryId = items.find((v) => v?.topCategoryId)?.topCategoryId || 0;
  const subCategoryId = items.find((v) => v?.subCategoryId)?.subCategoryId || 0;

  const topCategoryName = getTopCategoryName(
    dictionary?.categories || [],
    topCategoryId,
  );
  const subCategoryName = getSubCategoryName(
    dictionary?.categories || [],
    subCategoryId,
  );

  const sizeMap: SizeMap = useMemo(() => {
    const sizes = dictionary?.sizes || [];
    return sizes.reduce<SizeMap>((acc, s) => {
      if (s.id != null && s.name) {
        acc[s.id] = s.name.trim();
      }
      return acc;
    }, {});
  }, [dictionary?.sizes]);

  const handleShippingCarrierChange = (carrierId: string) => {
    if (firedShippingCarriers.has(carrierId)) {
      return;
    }

    const selectedCarrier = dictionary?.shipmentCarriers?.find(
      (c) => c.id?.toString() === carrierId,
    );
    const carrierName = selectedCarrier?.shipmentCarrier?.carrier || "";
    const freshItems = getItems();

    if (carrierName && freshItems.length > 0) {
      firedShippingCarriers.add(carrierId);
      sendAddShippingInfoEvent(
        freshItems as common_OrderItem[],
        carrierName,
        topCategoryName || "",
        subCategoryName || "",
        currency,
        sizeMap,
      );
    }
  };

  const handlePaymentMethodChange = (paymentMethodName: string) => {
    if (paymentEventFiredRef.current === paymentMethodName) {
      return;
    }

    const paymentMethodDisplayName =
      paymentMethodNamesMap[
        paymentMethodName as keyof typeof paymentMethodNamesMap
      ];
    const freshItems = getItems();

    if (paymentMethodDisplayName && freshItems.length > 0) {
      paymentEventFiredRef.current = paymentMethodName;
      sendAddPaymentInfoEvent(
        freshItems as common_OrderItem[],
        paymentMethodDisplayName,
        topCategoryName || "",
        subCategoryName || "",
        currency,
        sizeMap,
      );
    }
  };

  const handlePaymentElementComplete = () => {
    if (paymentEventFiredRef.current === "credit_card") {
      return;
    }

    const freshItems = getItems();
    if (freshItems.length > 0) {
      paymentEventFiredRef.current = "credit_card";
      sendAddPaymentInfoEvent(
        freshItems as common_OrderItem[],
        "credit_card",
        topCategoryName || "",
        subCategoryName || "",
        currency,
        sizeMap,
      );
    }
  };

  function handleBeginCheckoutEvent() {
    const freshItems = getItems();
    sendBeginCheckoutEvent(
      freshItems as common_OrderItem[],
      topCategoryName || "",
      subCategoryName || "",
      currency,
      sizeMap,
    );
  }

  const pagePath = () =>
    typeof window !== "undefined" ? window.location.pathname : "";

  function handleFormStart() {
    sendFormStartEvent({
      form_id: "checkout_form",
      form_name: "Checkout",
      page_path: pagePath(),
    });
  }

  function handleFormSubmit() {
    sendFormSubmitEvent({
      form_id: "checkout_form",
      form_name: "Checkout",
      page_path: pagePath(),
    });
  }

  function handleFormError(errorFields: string[]) {
    sendFormErrorEvent({
      form_id: "checkout_form",
      form_name: "Checkout",
      error_fields: errorFields,
      page_path: pagePath(),
    });
  }

  function handlePaymentFailed(params: {
    error_code: string;
    order_value: number;
    currency: string;
    transaction_id?: string;
  }) {
    sendPaymentFailedEvent({
      ...params,
      payment_type: "credit_card",
      page_path: pagePath(),
    });
  }

  return {
    sizeMap,
    topCategoryName,
    subCategoryName,
    handleBeginCheckoutEvent,
    handleShippingCarrierChange,
    handlePaymentMethodChange,
    handlePaymentElementComplete,
    handleFormStart,
    handleFormSubmit,
    handleFormError,
    handlePaymentFailed,
  };
}
