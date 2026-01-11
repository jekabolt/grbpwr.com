import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next/types";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation'
    },
    optimizePackageImports: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-popover'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.grbpwr.com",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year in seconds
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  pageExtensions: ["mdx", "ts", "tsx"],
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

