import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

import { getStoredCampaignParams } from "./campaign";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: any[];
    }
}

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

export function ensureGtag(): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
        const dl = window.dataLayer;
        window.gtag = function () {
            // eslint-disable-next-line prefer-rest-params
            dl.push(arguments);
        };
    }
}

const ANALYTICS_FLUSH_MS = 1500;

export function waitForAnalytics(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ANALYTICS_FLUSH_MS));
}

export function pushToDataLayer(event: EcommerceEvent): void {
    try {
        if (typeof window === "undefined") return;

        ensureGtag();
        const campaignParams = getCampaignParamsForEvents();

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });

        // Send via gtag command — processed by the direct GA4 script (G-YX09JT9HVC)
        // loaded in layout.tsx. Does NOT depend on GTM Custom Event triggers.
        window.gtag!("event", event.event, {
            ...event.ecommerce,
            ...campaignParams,
        });
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

        ensureGtag();
        const campaignParams = getCampaignParamsForEvents();

        // Send via gtag command — processed by the direct GA4 script (G-YX09JT9HVC)
        // loaded in layout.tsx. Does NOT depend on GTM Custom Event triggers.
        window.gtag!("event", event, {
            ...campaignParams,
            ...params,
        });
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

        ensureGtag();
        window.gtag!("set", { user_id: hashedId });

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
