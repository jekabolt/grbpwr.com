import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next/types";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation'
    },
    // Native View Transitions API for smooth cross-fades between routes.
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.grbpwr.com",
      },
      {
        protocol: "https",
        hostname: "art.grbpwr.com",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year in seconds
  },
  pageExtensions: ["mdx", "ts", "tsx"],
  async headers() {
    // Baseline security headers (no CSP — added separately once Stripe/Maps/
    // analytics origins are enumerated). Applied to every response.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Lock down powerful features the storefront doesn't use. Unlisted
      // features (e.g. payment for Stripe) keep their default allowlist.
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), browsing-topics=()' },
      // HSTS incl. subdomains (files/art.grbpwr.com are HTTPS); no `preload`.
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];
    const headers: { source: string; headers: { key: string; value: string }[] }[] = [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      });
    }
    return headers;
  },
};

export default withNextIntl(nextConfig);

