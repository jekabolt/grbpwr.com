import { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import {
    getLocaleFromCountry,
    supportedCountries,
} from "@/lib/middleware-utils";

const baseUrl = "https://grbpwr.com";

const defaultLocaleForCountry = (country: string): string => {
    const lng = getLocaleFromCountry(country);
    return routing.locales.includes(lng as (typeof routing.locales)[number])
        ? lng
        : routing.defaultLocale;
};

/**
 * Locale-agnostic path segments after /{country}/{locale}
 */
const STATIC_PATHS = [
    "",
    "/catalog",
    "/catalog/men",
    "/catalog/women",
    "/catalog/objects",
    "/timeline",
    "/faq",
    "/return",
    "/legal-notices",
    "/aftersale-services",
    "/order-status",
] as const;

/**
 * One entry per supported country × static path, using that country’s default
 * locale (same mapping as middleware). Pricing/VAT/currency differ by country,
 * so crawlers should see real market URLs — not a single gb-only slice.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const country of supportedCountries) {
        const locale = defaultLocaleForCountry(country);
        for (const path of STATIC_PATHS) {
            const urlPath = `/${country}/${locale}${path}`;
            const isHome = path === "";

            entries.push({
                url: `${baseUrl}${urlPath}`,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: isHome ? 1 : 0.8,
            });
        }
    }

    return entries;
}
