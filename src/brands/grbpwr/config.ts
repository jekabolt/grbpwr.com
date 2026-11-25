// grbpwr pack: everything that is grbpwr's own and must never reach another
// shop (analytics ids, copy, socials, legal markdown, icons, API catalog).
// Applied only when the shop profile says `pack: "grbpwr"`, or — while the
// backend does not send the field yet — when the request host is grbpwr's.
// Pure module (no React/Next imports): middleware, server, browser and the node
// test runner all read it.

export const GRBPWR_PACK = "grbpwr" as const;

/** Hosts that are grbpwr's even when the profile has no `pack` field yet. */
export const GRBPWR_HOSTS: readonly string[] = [
  "grbpwr.com",
  "www.grbpwr.com",
  "beta.grbpwr.com",
  "grbpwr.shop.lekalo.studio",
  "grbpwr.shop.beta.lekalo.studio",
];

/**
 * Hosts whose browsers still carry the pre-lekalo session cookies
 * (`grbpwr_access` / `grbpwr_refresh`). Only here are they read, so a cookie
 * tossed from a sibling `*.shop.lekalo.studio` can never fix a session.
 */
export const GRBPWR_LEGACY_COOKIE_HOSTS: readonly string[] = [
  "grbpwr.com",
  "www.grbpwr.com",
  "beta.grbpwr.com",
];

/** Static 308s of the pack (today's www → apex); grbpwr.com is never moved away. */
export const GRBPWR_HOST_REDIRECTS: Readonly<Record<string, string>> = {
  "www.grbpwr.com": "grbpwr.com",
};

/** Hosts that answer as themselves whatever the profile's primary host says. */
export const GRBPWR_STAY_HOSTS: readonly string[] = [
  "grbpwr.com",
  "beta.grbpwr.com",
];

export const GRBPWR_ANALYTICS = {
  gtmId: "GTM-WFC98J99",
  ga4Id: "G-YX09JT9HVC",
} as const;

export const GRBPWR_SITE = {
  /** Canonical origin (sitemap, canonical, og:url, JSON-LD), as before lekalo. */
  origin: "https://grbpwr.com",
  /** Title / og:site_name. */
  siteName: "grbpwr.com",
  /** Brand as a proper name: JSON-LD, apple web app title, og image alt. */
  brandName: "GRBPWR",
  /** Name in header, footer and account. */
  name: "grbpwr",
  description:
    "GRBPWR discusses difficult topics by imperfect language and master it. Shop latest ready-to-wear.",
  /** Help popover address. */
  email: "client@grbpwr.com",
  /** Client services page address. */
  clientServicesEmail: "info@grbpwr.com",
  sameAs: ["https://www.instagram.com/grb.pwr/"],
  socials: [
    { text: "ss", href: "https://substack.com/@grbpwr" },
    { text: "gh", href: "https://www.github.com/grbpwr/" },
    { text: "ig", href: "https://www.instagram.com/grb.pwr/" },
    { text: "tg", href: "https://www.t.me/grbpwr/" },
  ],
  /** Media host of the hero (LCP) images. */
  mediaOrigin: "https://files.grbpwr.com",
  /** Footer art iframe. */
  artOrigin: "https://art.grbpwr.com",
} as const;

/** Public API of grbpwr's backend (API catalog / OpenAPI routes). */
export const GRBPWR_API = {
  anchor: "https://backend.grbpwr.com/api/frontend",
  swagger: "https://backend.grbpwr.com/static/swagger/api.swagger.json",
  title: "grbpwr frontend REST API",
} as const;

/** Files under public/brands/grbpwr served at the site root on pack hosts. */
export const GRBPWR_ROOT_FILES: readonly string[] = [
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/app-logo.webp",
];

export const GRBPWR_PUBLIC_DIR = "/brands/grbpwr";

/** Web app manifest of grbpwr, as served before lekalo. */
export const GRBPWR_MANIFEST = {
  name: "GRBPWR",
  short_name: "GRBPWR",
  description: GRBPWR_SITE.description,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#ffffff",
  orientation: "portrait-primary",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
} as const;

/**
 * Pack markdown (legal pages, FAQ, tier privileges) as fetch candidates, in
 * the order the pre-lekalo storefront tried them. Keys are the shop profile
 * `legal` keys: a legal slug, "faq", or "tier-{slug}".
 */
export function grbpwrMarkdownPaths(key: string, locale: string): string[] {
  const base = `${GRBPWR_PUBLIC_DIR}/content`;
  if (key === "faq") {
    return [`${base}/faq/faq.${locale}.md`, `${base}/faq/faq.md`];
  }
  if (key.startsWith("tier-")) {
    const slug = key.slice("tier-".length);
    return [`${base}/tier/${slug}/${locale}.md`, `${base}/tier/${slug}/en.md`];
  }
  return [`${base}/legal/${key}/${locale}.md`, `${base}/legal/${key}/en.md`];
}
