import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { supportedCountries, getLocaleFromCountry } from '@/lib/middleware-utils'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://grbpwr.com'

    const staticPaths = [
        '',
        '/catalog',
        '/catalog/men',
        '/catalog/women',
        '/catalog/objects',
        '/timeline',
        '/about',
        '/shipping',
        '/contacts',
    ]

    const entries: MetadataRoute.Sitemap = []

    // One canonical URL per (country, locale) for main pages
    // Uses country+locale path format: /{country}/{locale}/...
    for (const country of supportedCountries) {
        const locale = getLocaleFromCountry(country)
        if (!(routing.locales as readonly string[]).includes(locale)) continue

        for (const path of staticPaths) {
            const fullPath = `/${country}/${locale}${path}`
            entries.push({
                url: `${baseUrl}${fullPath}`,
                lastModified: new Date(),
                changeFrequency: path === '' ? 'daily' : 'weekly',
                priority: path === '' ? 1 : 0.8,
            })
        }
    }

    return entries
}

