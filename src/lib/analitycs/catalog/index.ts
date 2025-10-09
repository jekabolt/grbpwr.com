import { common_Product } from "@/api/proto-http/frontend";

interface AnalyticsItem {
    item_id: string;
    item_name: string;
    item_brand: string;
    item_variant: string;
    discount: number;
    price: number;
    index: number;
    quantity: number;
}

interface EcommerceEvent {
    event: string;
    ecommerce: {
        currency: string;
        item_list_id: string;
        item_list_name: string;
        items: AnalyticsItem[];
    };
}

function mapProductToAnalyticsItem(product: common_Product): AnalyticsItem {
    const productBody = product.productDisplay?.productBody?.productBodyInsert
    const price = parseFloat(productBody?.price?.value || "0")
    const salePercentage = parseFloat(productBody?.salePercentage?.value || "0");
    const discount = (price * salePercentage) / 100;

    return {
        item_id: product.sku || "",
        item_name: product.productDisplay?.productBody?.translations?.[0]?.name || "",
        item_brand: productBody?.brand || "",
        item_variant: productBody?.version || "",
        discount: discount || 0,
        price: price || 0,
        index: product.id || 0,
        quantity: 1,
    };
}

function pushToDataLayer(event: EcommerceEvent): void {
    try {
        if (typeof window === "undefined") return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push(event);
    } catch (error) {
        console.warn("Analytics tracking failed:", error);
    }
}

export function sendViewItemListEvent(
    products: common_Product[],
    listName: string,
    listId: string,
): void {
    if (!products?.length || !listName || !listId) return;

    const event: EcommerceEvent = {
        event: "view_item_list",
        ecommerce: {
            currency: "EUR",
            item_list_id: listId,
            item_list_name: listName,
            items: products.map((product) => mapProductToAnalyticsItem(product)),
        },
    };

    pushToDataLayer(event);
}

export function selectItemEvent(
    product: common_Product,
    listName: string,
    listId: string,
): void {
    if (!product || !listName || !listId) return;

    const event: EcommerceEvent = {
        event: 'select_item',
        ecommerce: {
            currency: "EUR",
            item_list_id: listId,
            item_list_name: listName,
            items: [mapProductToAnalyticsItem(product)]
        }
    };

    pushToDataLayer(event);
}