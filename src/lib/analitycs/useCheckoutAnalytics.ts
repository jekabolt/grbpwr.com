import { common_OrderItem } from "@/api/proto-http/frontend";
import { paymentMethodNamesMap } from "@/constants";

import { useDataContext } from "@/components/contexts/DataContext";

import { getSubCategoryName, getTopCategoryName } from "../categories-map";
import { useCart } from "../stores/cart/store-provider";
import { useTranslationsStore } from "../stores/translations/store-provider";
import {
    sendAddPaymentInfoEvent,
    sendAddShippingInfoEvent,
    sendBeginCheckoutEvent,
    sendPurchaseEvent
} from "./checkout";

export function useCheckoutAnalytics() {
    const { dictionary } = useDataContext();
    const { currentCountry } = useTranslationsStore((state) => state);
    const items = useCart((state) => state.products).map((v) => v.productData);
    const currency = currentCountry.currencyKey || "EUR";

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

    const handleShippingCarrierChange = (carrierId: string) => {
        const selectedCarrier = dictionary?.shipmentCarriers?.find(
            (c) => c.id?.toString() === carrierId,
        );
        const carrierName = selectedCarrier?.shipmentCarrier?.carrier || "";

        if (carrierName && items.length > 0) {
            sendAddShippingInfoEvent(
                items as common_OrderItem[],
                carrierName,
                topCategoryName || "",
                subCategoryName || "",
                currency,
            );
        }
    };

    const handlePaymentMethodChange = (paymentMethodName: string) => {
        const paymentMethodDisplayName =
            paymentMethodNamesMap[
            paymentMethodName as keyof typeof paymentMethodNamesMap
            ];

        if (paymentMethodDisplayName && items.length > 0) {
            sendAddPaymentInfoEvent(
                items as common_OrderItem[],
                paymentMethodDisplayName,
                topCategoryName || "",
                subCategoryName || "",
                currency,
            );
        }
    };

    function handleBeginCheckoutEvent() {
        sendBeginCheckoutEvent(
            items as common_OrderItem[],
            topCategoryName || "",
            subCategoryName || "",
            currency,
        );
    }

    function handlePurchaseEvent(uuid: string) {
        sendPurchaseEvent(
            items as common_OrderItem[],
            uuid,
            topCategoryName || "",
            subCategoryName || "",
            currency,
        );
    }

    return {
        topCategoryName,
        subCategoryName,
        handleBeginCheckoutEvent,
        handleShippingCarrierChange,
        handlePaymentMethodChange,
        handlePurchaseEvent,
    };
}
