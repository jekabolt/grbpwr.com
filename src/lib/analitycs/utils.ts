import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

import { getStoredCampaignParams } from "./campaign";

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

        const campaignParams = getCampaignParamsForEvents();
        const eventWithCampaign = { ...campaignParams, ...event };

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push(eventWithCampaign);
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

export function getCampaignParamsForEvents(): Record<string, unknown> {
    const campaign = getStoredCampaignParams();
    if (!campaign || Object.keys(campaign).length === 0) return {};
    return {
        first_user_campaign: [campaign.utm_source, campaign.utm_medium, campaign.utm_campaign]
            .filter(Boolean)
            .join("|") || undefined,
        ...campaign,
    };
}

export function pushCustomEvent(event: string, params: Record<string, unknown>): void {
    try {
        if (typeof window === "undefined") return;

        const campaignParams = getCampaignParamsForEvents();

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...campaignParams, ...params });
    } catch (error) {
        console.warn("Analytics tracking failed:", error);
    }
}

export async function pushUserIdToDataLayer(email: string): Promise<void> {
    try {
        if (typeof window === "undefined" || !email) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(email.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ user_id: hashedId });
    } catch (error) {
        console.warn("Analytics user_id tracking failed:", error);
    }
}

export type SizeMap = Record<number, string>;

export const calculateTotalValue = (items: common_OrderItem[]): number => {
    return items.reduce((sum, item) => {
        const price = parseFloat(item.productPrice || "0");
        const quantity = item.orderItem?.quantity || 1;
        return sum + price * quantity;
    }, 0);
};
