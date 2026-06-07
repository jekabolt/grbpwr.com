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

// hreflang value (language-region) per locale, pointing at the canonical country
// version above. Mirrors CANONICAL_COUNTRY_BY_LOCALE.
const HREFLANG_BY_LOCALE: Record<string, string> = {
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
};

// Open Graph locale (language_TERRITORY) per locale. Mirrors HREFLANG_BY_LOCALE.
const OG_LOCALE_BY_LOCALE: Record<string, string> = {
  en: "en_GB",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  ja: "ja_JP",
  zh: "zh_CN",
  ko: "ko_KR",
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

/**
 * hreflang alternates for a locale-relative path. Every supported locale points
 * at its canonical country version (so non-canonical country variants don't
 * compete), plus an x-default fallback on /gb/en — consistent with canonicalUrl.
 */
function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const [locale, country] of Object.entries(CANONICAL_COUNTRY_BY_LOCALE)) {
    const hreflang = HREFLANG_BY_LOCALE[locale];
    if (hreflang) {
      languages[hreflang] = `${SITE_URL}/${country}/${locale}${path}`;
    }
  }
  languages["x-default"] = `${SITE_URL}/gb/en${path}`;
  return languages;
}

type GenerateOgParams = {
  title?: string;
  description?: string;
  imageUrl?: string;
  // Omit width/height when the real image dimensions are unknown (e.g. a product
  // photo) rather than asserting a wrong fixed size — scrapers infer from the
  // image. Only pass them when they're actually correct (e.g. the square logo).
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  // "product" suppresses the default og:type=website here: Next's metadata API
  // can't emit og:type=product (it throws on types outside its fixed union), so
  // product pages render og:type=product + product:price:* as <meta property>
  // JSX themselves. Setting this avoids a duplicate/conflicting og:type tag.
  type?: "website" | "product";
};

export function generateOpenGraph({
  title = "grbpwr.com",
  description = "GRBPWR discusses difficult topics by imperfect language and master it. Shop latest ready-to-wear.",
  imageUrl = logo.src,
  imageWidth,
  imageHeight,
  imageAlt = "GRBPWR",
  type = "website",
}: GenerateOgParams = {}): Metadata["openGraph"] {
  return {
    title,
    description,
    // Only emit the typed "website" og:type here. Product pages pass
    // type:"product" to suppress it and render og:type=product themselves (see
    // the `type` note above).
    ...(type === "website" ? { type } : {}),
    siteName: "grbpwr.com",
    images: [
      {
        url: imageUrl,
        ...(imageWidth ? { width: imageWidth } : {}),
        ...(imageHeight ? { height: imageHeight } : {}),
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
  // canonical <link> and hreflang alternates. Omit on layout-level metadata so
  // leaf pages own them.
  locale?: string;
  path?: string;
} = {}): Metadata {
  const canonical = canonicalUrl(locale, path);
  const languages = locale ? languageAlternates(path) : undefined;

  // og:locale / og:locale:alternate (only when the page's locale is known).
  const ogLocale = locale ? OG_LOCALE_BY_LOCALE[locale] : undefined;
  const ogAlternateLocales = ogLocale
    ? Object.values(OG_LOCALE_BY_LOCALE).filter((l) => l !== ogLocale)
    : undefined;

  return {
    title: {
      default: title,
      template: "%s - grbpwr.com",
    },
    description,
    ...(canonical || languages
      ? {
          alternates: {
            ...(canonical ? { canonical } : {}),
            ...(languages ? { languages } : {}),
          },
        }
      : {}),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "GRBPWR",
    },
    icons: {
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      ...generateOpenGraph({
        title,
        description: description,
        ...ogParams,
      }),
      ...(ogLocale
        ? { locale: ogLocale, alternateLocale: ogAlternateLocales }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description,
      images: [ogParams.imageUrl || logo.src],
    },
  };
}
