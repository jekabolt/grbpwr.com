import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://grbpwr.com'

    // Static pages
    const staticPages = [
        '',
        '/en',
        '/en/catalog',
        '/en/catalog/men',
        '/en/catalog/women',
        '/en/catalog/objects',
        '/en/timeline',
        '/en/about',
        '/en/shipping',
        '/en/contacts',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' || route === '/en' ? 1 : 0.8,
    }))

    return staticPages
}

