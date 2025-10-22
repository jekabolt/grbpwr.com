import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

import { mapItemsToAnalyticsItems } from "../checkout";
import { mapItemsToDataLayer } from "../product";
import { calculateTotalValue, EcommerceEvent, pushToDataLayer } from "../utils";

export function sendAddToCartEvent(
    item: common_ProductFull,
    topCategory: string,
    subCategory: string,
) {
    const productBody = item.product?.productDisplay?.productBody;
    const totalValue = parseFloat(
        productBody?.productBodyInsert?.price?.value || "0",
    );

    if (!item || !item.product) return;

    const event: EcommerceEvent = {
        event: "add_to_cart",
        ecommerce: {
            currency: "EUR",
            value: totalValue,
            items: [mapItemsToDataLayer(item.product, 1, topCategory, subCategory)],
        },
    };

    pushToDataLayer(event);
}

export function sendRemoveFromCartEvent(
    item: common_OrderItem,
    topCategory: string,
    subCategory: string,
) {
    const totalValue = parseFloat(item.productPrice || "0");

    if (!item) return;

    const event: EcommerceEvent = {
        event: "remove_from_cart",
        ecommerce: {
            currency: "EUR",
            value: totalValue,
            items: [mapItemsToAnalyticsItems(item, 1, topCategory, subCategory)],
        },
    };

    pushToDataLayer(event);
}

export function sendViewCartEvent(
    items: common_OrderItem[],
    topCategory: string,
    subCategory: string,
) {
    const totalValue = calculateTotalValue(items);

    if (!items || !items?.length) return;

    const event: EcommerceEvent = {
        event: "view_cart",
        ecommerce: {
            currency: "EUR",
            value: totalValue,
            items: items.map((item) =>
                mapItemsToAnalyticsItems(item, 1, topCategory, subCategory),
            ),
        },
    };

    pushToDataLayer(event);
}
