import { Metadata } from "next";

import logo from "../../public/app-logo.webp";

const SITE_URL = "https://grbpwr.com";

// Canonical country per locale — kept in sync with the sitemap/hreflang
// (CANONICAL_COUNTRY_BY_LOCALE in lib/sitemap/build-entries). Country variants
// of the same locale (e.g. /us/en) canonicalise to this one indexed version.
const CANONICAL_COUNTRY_BY_LOCALE: Record<string, string> = {
  en: "gb",
  fr: "fr",
  de: "de",
  it: "it",
  ja: "jp",
  zh: "cn",
  ko: "kr",
};

/** Absolute canonical URL for a page, given its locale and locale-relative path. */
export function canonicalUrl(
  locale?: string,
  path = "",
): string | undefined {
  if (!locale) return undefined;
  const country = CANONICAL_COUNTRY_BY_LOCALE[locale];
  if (!country) return undefined;
  return `${SITE_URL}/${country}/${locale}${path}`;
}

type GenerateOgParams = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
};

export function generateOpenGraph({
  title = "grbpwr.com",
  description = "GRBPWR discusses difficult topics by imperfect language and master it. Shop latest ready-to-wear.",
  imageUrl = logo.src,
  imageWidth = 512,
  imageHeight = 512,
  imageAlt = "GRBPWR",
}: GenerateOgParams = {}): Metadata["openGraph"] {
  return {
    title,
    description,
    type: "website",
    siteName: "grbpwr.com",
    images: [
      {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
      },
    ],
  };
}

export function generateCommonMetadata({
  title = "grbpwr.com",
  description = "GRBPWR discusses difficult topics by imperfect language and master it. Shop latest ready-to-wear.",
  ogParams = {},
  locale,
  path,
}: {
  title?: string;
  templateTitle?: string;
  description?: string;
  ogParams?: GenerateOgParams;
  // Pass locale + locale-relative path (e.g. "" or "/product/...") to emit a
  // canonical <link>. Omit on layout-level metadata so leaf pages own it.
  locale?: string;
  path?: string;
} = {}): Metadata {
  const canonical = canonicalUrl(locale, path);

  return {
    title: {
      default: title,
      template: "%s - grbpwr.com",
    },
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "GRBPWR",
    },
    openGraph: generateOpenGraph({
      title,
      description: description,
      ...ogParams,
    }),
    twitter: {
      card: "player",
      title,
      description: description,
      images: [ogParams.imageUrl || logo.src],
    },
  };
}
