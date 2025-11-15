import { common_Product, common_ProductFull } from "@/api/proto-http/frontend";

import {
    AnalyticsItem,
    EcommerceEvent,
    getTotalProductQuantity,
    getTotalProductValue,
    pushToDataLayer,
} from "../utils";

export function mapItemsToDataLayer(
    product: common_Product,
    quantity: number,
    topCategory: string,
    subCategory: string,
): AnalyticsItem {
    const productBody = product.productDisplay?.productBody?.productBodyInsert;
    const price = parseFloat(product.prices?.[0].price?.value || "0");
    const salePercentage = parseFloat(productBody?.salePercentage?.value || "0");
    const discount = (price * salePercentage) / 100;

    return {
        item_id: product.sku || "",
        item_name:
            product.productDisplay?.productBody?.translations?.[0]?.name || "",
        item_brand: productBody?.brand || "",
        item_category: topCategory || "",
        item_category2: subCategory || "",
        item_variant: productBody?.version || "",
        discount: discount || 0,
        price: price || 0,
        quantity: quantity || 1,
    };
}

export function sendViewItemListEvent(
    products: common_Product[],
    listName: string,
    listId: string,
    topCategory: string,
    subCategory: string,
) {
    if (!products?.length || !listName || !listId) return;

    const event: EcommerceEvent = {
        event: "view_item_list",
        ecommerce: {
            currency: "EUR",
            item_list_id: listId,
            item_list_name: listName,
            items: products.map((p) =>
                mapItemsToDataLayer(p, 1, topCategory, subCategory),
            ),
        },
    };

    pushToDataLayer(event);
}

export function sendSelectItemEvent(
    product: common_Product,
    listName: string,
    listId: string,
    topCategory: string,
    subCategory: string,
) {
    if (!product || !listName || !listId) return;

    const event: EcommerceEvent = {
        event: "select_item",
        ecommerce: {
            currency: "EUR",
            item_list_id: listId,
            item_list_name: listName,
            items: [mapItemsToDataLayer(product, 1, topCategory, subCategory)],
        },
    };

    pushToDataLayer(event);
}

export function sendViewItemEvent(
    product: common_ProductFull,
    topCategory: string,
    subCategory: string,
) {
    const totalValue = getTotalProductValue(product);
    const totalQuantity = getTotalProductQuantity(product);

    if (!product || !product?.product) return;

    const event: EcommerceEvent = {
        event: "view_item",
        ecommerce: {
            currency: "EUR",
            value: totalValue,
            items: [
                mapItemsToDataLayer(
                    product.product,
                    totalQuantity,
                    topCategory,
                    subCategory,
                ),
            ],
        },
    };

    pushToDataLayer(event);
}
