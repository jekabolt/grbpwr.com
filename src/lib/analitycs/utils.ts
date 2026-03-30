import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

import { getStoredCampaignParams } from "./campaign";

/** Single source of truth — must match gtag `config` / script `id` in layout. */
export const GA4_MEASUREMENT_ID = "G-YX09JT9HVC";

const GA4_CLIENT_ID_SESSION_KEY = "grbpwr_ga4_client_id";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: any[];
    }
}

export function isLikelyGa4ClientId(value: unknown): value is string {
    return typeof value === "string" && /^\d+\.\d+$/.test(value.trim());
}

/** gtag `get` passes the field value; tolerate edge shapes. */
export function normalizeGtagClientIdField(raw: unknown): string | undefined {
    if (isLikelyGa4ClientId(raw)) return raw.trim();
    if (raw && typeof raw === "object" && "client_id" in raw) {
        const v = (raw as { client_id?: unknown }).client_id;
        if (isLikelyGa4ClientId(v)) return v.trim();
    }
    return undefined;
}

export function readStoredGa4ClientId(): string | undefined {
    try {
        if (typeof sessionStorage === "undefined") return undefined;
        const v = sessionStorage.getItem(GA4_CLIENT_ID_SESSION_KEY)?.trim();
        return isLikelyGa4ClientId(v) ? v : undefined;
    } catch {
        return undefined;
    }
}

export function writeStoredGa4ClientId(clientId: string): void {
    try {
        if (!isLikelyGa4ClientId(clientId)) return;
        sessionStorage.setItem(GA4_CLIENT_ID_SESSION_KEY, clientId.trim());
    } catch {
        // private mode / disabled storage
    }
}

/** Ask gtag for client_id and cache when available (safe to call often). */
export function refreshGa4ClientIdToStorage(): void {
    if (typeof window === "undefined") return;
    ensureGtag();
    try {
        window.gtag!("get", GA4_MEASUREMENT_ID, "client_id", (raw: unknown) => {
            const id = normalizeGtagClientIdField(raw);
            if (id) writeStoredGa4ClientId(id);
        });
    } catch {
        // ignore
    }
}

export function parseClientIdFromGaCookieString(cookieValue: string): string | undefined {
    const parts = cookieValue.split(".");
    if (parts.length < 4) return undefined;
    const id = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    return isLikelyGa4ClientId(id) ? id : undefined;
}

export function readGa4ClientIdFromDocumentCookie(): string | undefined {
    if (typeof document === "undefined") return undefined;
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const row of cookies) {
        if (!row.startsWith("_ga=")) continue;
        const value = row.slice(4);
        const id = parseClientIdFromGaCookieString(value);
        if (id) return id;
    }
    return undefined;
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

        // Send via gtag command — processed by the direct GA4 script in layout.tsx.
        window.gtag!("event", event.event, {
            ...event.ecommerce,
            ...campaignParams,
        });
    } catch (error) {
        console.warn("Analytics tracking failed:", error);
    }
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

        // Send via gtag command — processed by the direct GA4 script in layout.tsx.
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
