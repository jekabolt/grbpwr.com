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
    selectedCurrency: string,
): AnalyticsItem {
    const currencyKey = selectedCurrency || "EUR";
    const productBody = product.productDisplay?.productBody?.productBodyInsert;
    const price = product.prices?.find(
        (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];
    const priceValue = parseFloat(price?.price?.value || "0");
    const salePercentage = parseFloat(productBody?.salePercentage?.value || "0");
    const discount = (priceValue * salePercentage) / 100;

    return {
        item_id: product.sku || "",
        item_name:
            product.productDisplay?.productBody?.translations?.[0]?.name || "",
        item_brand: productBody?.brand || "",
        item_category: topCategory || "",
        item_category2: subCategory || "",
        item_variant: productBody?.version || "",
        discount: discount || 0,
        price: priceValue || 0,
        quantity: quantity || 1,
    };
}

export function sendViewItemListEvent(
    products: common_Product[],
    listName: string,
    listId: string,
    topCategory: string,
    subCategory: string,
    selectedCurrency: string,
) {
    if (!products?.length || !listName || !listId) return;

    const currencyKey = selectedCurrency || "EUR";
    const event: EcommerceEvent = {
        event: "view_item_list",
        ecommerce: {
            currency: currencyKey.toUpperCase(),
            item_list_id: listId,
            item_list_name: listName,
            items: products.map((p) =>
                mapItemsToDataLayer(p, 1, topCategory, subCategory, selectedCurrency),
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
    selectedCurrency: string,
) {
    if (!product || !listName || !listId) return;

    const currencyKey = selectedCurrency || "EUR";
    const event: EcommerceEvent = {
        event: "select_item",
        ecommerce: {
            currency: currencyKey.toUpperCase(),
            item_list_id: listId,
            item_list_name: listName,
            items: [mapItemsToDataLayer(product, 1, topCategory, subCategory, selectedCurrency)],
        },
    };

    pushToDataLayer(event);
}

export function sendViewItemEvent(
    product: common_ProductFull,
    topCategory: string,
    subCategory: string,
    selectedCurrency: string,
) {
    const currencyKey = selectedCurrency || "EUR";
    const totalValue = getTotalProductValue(product, currencyKey);
    const totalQuantity = getTotalProductQuantity(product);

    if (!product || !product?.product) return;

    const event: EcommerceEvent = {
        event: "view_item",
        ecommerce: {
            currency: currencyKey.toUpperCase(),
            value: totalValue,
            items: [
                mapItemsToDataLayer(
                    product.product,
                    totalQuantity,
                    topCategory,
                    subCategory,
                    selectedCurrency,
                ),
            ],
        },
    };

    pushToDataLayer(event);
}
