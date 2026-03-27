import { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const baseUrl = "https://grbpwr.com";

const CANONICAL_COUNTRY_BY_LOCALE = {
    en: "gb",
    fr: "fr",
    de: "de",
    it: "it",
    ja: "jp",
    zh: "cn",
    ko: "kr",
} satisfies Record<(typeof routing.locales)[number], string>;

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

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of routing.locales) {
        const country = CANONICAL_COUNTRY_BY_LOCALE[locale];
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
