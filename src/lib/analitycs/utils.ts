import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

export interface EcommerceEvent {
    event: string;
    ecommerce: {
        currency: string;
        [key: string]: any;
    };
}

export interface AnalyticsItem {
    item_id: string;
    item_name: string;
    item_brand: string;
    item_category: string;
    item_category2: string;
    item_variant: string;
    discount: number;
    price: number;
    quantity: number;
}

export function pushToDataLayer(event: EcommerceEvent): void {
    try {
        if (typeof window === "undefined") return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push(event);
    } catch (error) {
        console.warn("Analytics tracking failed:", error);
    }
}

export function getTotalProductQuantity(product: common_ProductFull): number {
    if (!product?.sizes || product.sizes.length === 0) {
        return 0;
    }

    return product.sizes.reduce((total, size) => {
        const quantity = parseInt(size.quantity?.value || "0");
        return total + quantity;
    }, 0);
}

export function getTotalProductValue(product: common_ProductFull, selectedCurrency: string): number {
    if (!product?.sizes || product.sizes.length === 0) {
        return 0;
    }

    const price = product.product?.prices?.find(
        (p) => p.currency?.toUpperCase() === selectedCurrency.toUpperCase(),
    ) || product.product?.prices?.[0];
    const priceValue = parseFloat(price?.price?.value || "0");
    return product.sizes.reduce((total, size) => {
        const quantity = parseInt(size.quantity?.value || "0");
        return total + quantity * priceValue;
    }, 0);
}

export const calculateTotalValue = (items: common_OrderItem[]): number => {
    return items.reduce((sum, item) => {
        const price = parseFloat(item.productPrice || "0");
        const quantity = item.orderItem?.quantity || 1;
        return sum + price * quantity;
    }, 0);
};
