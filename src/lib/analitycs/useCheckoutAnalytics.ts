import { common_OrderItem } from "@/api/proto-http/frontend";
import { paymentMethodNamesMap } from "@/constants";
import { useMemo, useContext, useRef, useEffect } from "react";

import { useDataContext } from "@/components/contexts/DataContext";

import { getSubCategoryName, getTopCategoryName } from "../categories-map";
import { useCart, CartStoreContext } from "../stores/cart/store-provider";
import { useTranslationsStore } from "../stores/translations/store-provider";
import {
    PurchaseOptions,
    sendAddPaymentInfoEvent,
    sendAddShippingInfoEvent,
    sendBeginCheckoutEvent,
    sendPurchaseEvent,
} from "./checkout";
import { refreshGa4ClientIdToStorage, SizeMap } from "./utils";

export function useCheckoutAnalytics() {
    const { dictionary } = useDataContext();
    const { currentCountry } = useTranslationsStore((state) => state);
    const cartStore = useContext(CartStoreContext);
    const currency = currentCountry.currencyKey || "EUR";
    
    const shippingEventFiredRef = useRef<string | null>(null);
    const paymentEventFiredRef = useRef<string | null>(null);

    useEffect(() => {
        refreshGa4ClientIdToStorage();
    }, []);

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
        if (shippingEventFiredRef.current === carrierId) {
            return;
        }
        
        const selectedCarrier = dictionary?.shipmentCarriers?.find(
            (c) => c.id?.toString() === carrierId,
        );
        const carrierName = selectedCarrier?.shipmentCarrier?.carrier || "";
        const freshItems = getItems();

        if (carrierName && freshItems.length > 0) {
            shippingEventFiredRef.current = carrierId;
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

    function handlePurchaseEvent(uuid: string, options?: PurchaseOptions) {
        const freshItems = getItems();
        sendPurchaseEvent(
            freshItems as common_OrderItem[],
            uuid,
            topCategoryName || "",
            subCategoryName || "",
            currency,
            sizeMap,
            options,
        );
    }

    return {
        sizeMap,
        topCategoryName,
        subCategoryName,
        handleBeginCheckoutEvent,
        handleShippingCarrierChange,
        handlePaymentMethodChange,
        handlePaymentElementComplete,
        handlePurchaseEvent,
    };
}
