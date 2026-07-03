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

    // Content-Security-Policy — ENFORCED. Rolled out Report-Only first to
    // confirm every third-party origin (Stripe, Google Maps, GTM/GA) was
    // covered with no violations; now switched to the enforcing header.
    // Violations are still reported to /api/csp-report.
    //
    // 'unsafe-inline' is intentionally kept for now: GTM/GA inject inline
    // scripts and there's an inline theme bootstrap in layout.tsx; a per-request
    // nonce would force dynamic rendering and break the force-static
    // catalog/product/home pages. The allowlist still blocks loading scripts
    // from any non-listed origin (the Magecart/skimmer threat). Removing
    // 'unsafe-inline' via nonce + strict-dynamic is a deliberate later step.
    //
    // frame-ancestors is parameterised: every path is 'self' only (anti-
    // clickjacking, especially checkout/account), except /preview/* which also
    // allows the admin origins so the hero editor can embed the preview iframe.
    const buildCsp = (frameAncestors: string) =>
      [
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
        // Stripe (payments) + art.grbpwr.com (footer logo) + curated hero EMBED
        // providers (Spline 3D, YouTube/Vimeo campaign embeds). An unlisted or
        // blocked embed degrades to the block's fallback media, so this stays a
        // tight allowlist rather than a wildcard.
        `frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network https://art.grbpwr.com https://my.spline.design https://prod.spline.design https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com`,
        `worker-src 'self' blob:`,
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors ${frameAncestors}`,
        `report-uri /api/csp-report`,
        `report-to csp-endpoint`,
      ].join("; ");

    // Origins allowed to frame the hero-editor preview (/preview/*). Must match
    // the ADMIN_ORIGINS allowlist in hero-preview-client.tsx. localhost is dev
    // only — prod/beta storefront never needs a local framer.
    const previewFrameAncestors = [
      "https://admin.grbpwr.com",
      "https://admin.beta.grbpwr.com",
      ...(isDev ? ["http://localhost:4040"] : []),
    ].join(" ");

    const csp = buildCsp("'self'");
    const previewCsp = buildCsp(`'self' ${previewFrameAncestors}`);

    // Security headers shared by every path. Framing headers (CSP + XFO) are
    // added per-scope below because /preview/* needs different framing rules.
    const baseSecurityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
      // Reporting target for the CSP above (modern Reporting API).
      { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
    ];

    // Default: same-origin framing only. X-Frame-Options backs up frame-ancestors
    // for legacy browsers that don't honour CSP.
    const securityHeaders = [
      ...baseSecurityHeaders,
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Content-Security-Policy", value: csp },
    ];

    // Preview: drop X-Frame-Options entirely — it has no cross-origin allow value
    // (ALLOW-FROM is dead), so a lingering SAMEORIGIN would veto the admin embed.
    // frame-ancestors (admin origins) is the modern, per-origin replacement.
    const previewSecurityHeaders = [
      ...baseSecurityHeaders,
      { key: "Content-Security-Policy", value: previewCsp },
    ];
    const headers: {
      source: string;
      headers: { key: string; value: string }[];
    }[] = [
      // Preview framing rules first. These paths are EXCLUDED from the global
      // block below (negative lookahead) so exactly one CSP header is emitted —
      // duplicate CSP headers would intersect frame-ancestors back to 'self' and
      // re-block the embed. The three sources cover the raw, locale-prefixed and
      // country+locale forms the i18n middleware can produce for /preview/*.
      { source: "/preview/:path*", headers: previewSecurityHeaders },
      { source: "/:locale/preview/:path*", headers: previewSecurityHeaders },
      {
        source: "/:country/:locale/preview/:path*",
        headers: previewSecurityHeaders,
      },
      {
        // Every non-preview path. The lookahead excludes a `preview` segment in
        // position 0–2 (handled above); product slugs merely containing the
        // substring "preview" still match and keep the strict headers.
        source: "/((?!(?:[^/]+/){0,2}preview/).*)",
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
