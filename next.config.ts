import type { NextConfig } from "next/types";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "annotation",
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
    const isDev = process.env.NODE_ENV !== "production";

    // Backend origin for connect-src, derived from the public env var so dev
    // (localhost) and prod (backend.grbpwr.com) both work.
    let backendOrigin = "";
    try {
      backendOrigin = new URL(process.env.NEXT_PUBLIC_BACKEND_URL ?? "").origin;
    } catch {
      backendOrigin = "";
    }

    // Content-Security-Policy — shipped as **Report-Only** first: it enforces
    // nothing but reports violations (to /api/csp-report and the console), so we
    // can confirm every third-party origin (Stripe, Google Maps, GTM/GA) is
    // covered before flipping the header name to `Content-Security-Policy`.
    //
    // 'unsafe-inline' is intentionally kept for now: GTM/GA inject inline
    // scripts and there's an inline theme bootstrap in layout.tsx; a per-request
    // nonce would force dynamic rendering and break the force-static
    // catalog/product/home pages. The allowlist still blocks loading scripts
    // from any non-listed origin (the Magecart/skimmer threat). Removing
    // 'unsafe-inline' via nonce + strict-dynamic is a deliberate later step.
    const csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://maps.googleapis.com`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob: https://files.grbpwr.com https://art.grbpwr.com https://cdn.builder.io https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleusercontent.com https://*.stripe.com`,
      `font-src 'self' data:`,
      [
        `connect-src 'self'`,
        backendOrigin,
        "https://www.google-analytics.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://www.googletagmanager.com",
        "https://api.stripe.com",
        // Stripe.js fraud signals (m.stripe.network) + metrics (r.stripe.com) —
        // documented Stripe origins, reliably hit by Payment Element / 3DS.
        "https://m.stripe.network",
        "https://r.stripe.com",
        "https://maps.googleapis.com",
        // Dev only: Turbopack HMR websocket + localhost backend.
        ...(isDev ? ["ws://localhost:*", "http://localhost:*"] : []),
      ]
        .filter(Boolean)
        .join(" "),
      `frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network https://art.grbpwr.com`,
      `worker-src 'self' blob:`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'self'`,
      `report-uri /api/csp-report`,
      `report-to csp-endpoint`,
    ].join("; ");

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      // Lock down powerful features the storefront doesn't use. Unlisted
      // features (e.g. payment for Stripe) keep their default allowlist.
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), browsing-topics=()",
      },
      // HSTS incl. subdomains (files/art.grbpwr.com are HTTPS); no `preload`.
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      },
      // Reporting target for the Report-Only CSP above (modern Reporting API).
      { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
      { key: "Content-Security-Policy-Report-Only", value: csp },
    ];
    const headers: {
      source: string;
      headers: { key: string; value: string }[];
    }[] = [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
    if (process.env.NODE_ENV === "production") {
      headers.push({
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      });
    }
    return headers;
  },
};

export default withNextIntl(nextConfig);
