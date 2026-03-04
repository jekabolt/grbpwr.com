import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/trpc/'],
      },
      // Google: allow all, use sitemap for discovery
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot-Image', allow: '/' },
    ],
    host: 'https://grbpwr.com',
    sitemap: 'https://grbpwr.com/sitemap.xml',
  }
}

