"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  COUNTRIES_BY_REGION,
  LANGUAGE_CODE_TO_ID,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";

import { parseCountryLocalePath } from "@/lib/middleware-utils";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

/**
 * Syncs translations store with URL when path has /{country}/{locale} but store
 * has wrong country (e.g. static RSC cache, edge, template remount).
 *
 * usePathname() may return the rewritten path (/{locale}/...) rather than the
 * browser URL (/{country}/{locale}/...) depending on the middleware rewrite, so
 * we also read the next-intl locale as a fallback for the locale value.
 */
export function UrlCountrySync() {
  const pathname = usePathname();
  const intlLocale = useLocale();
  const { currentCountry, languageId, setCurrentCountry, setLanguageId } =
    useTranslationsStore((s) => s);

  useEffect(() => {
    const parsed = parseCountryLocalePath(pathname ?? "");

    const urlCountry = parsed?.country?.toLowerCase();
    // After middleware rewrite, usePathname() returns /{locale}/... so
    // parseCountryLocalePath may fail. Fall back to the next-intl locale.
    const urlLocale = parsed?.locale ?? intlLocale;

    if (!urlLocale) return;

    const storeLocale = LANGUAGE_ID_TO_LOCALE[languageId];

    // When we have full country/locale from URL, sync both.
    // When only locale available (rewritten path), sync just the locale.
    if (urlCountry) {
      const storeCountry = currentCountry.countryCode?.toLowerCase();
      if (storeCountry === urlCountry && storeLocale === urlLocale) return;

      for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
        const c = list.find(
          (x) =>
            x.countryCode.toLowerCase() === urlCountry && x.lng === urlLocale,
        );
        if (c) {
          setCurrentCountry({
            name: c.name,
            countryCode: c.countryCode,
            currencyKey: c.currencyKey,
          });
          const langId = LANGUAGE_CODE_TO_ID[urlLocale];
          if (langId !== undefined) setLanguageId(langId);
          return;
        }
      }

      for (const [, list] of Object.entries(COUNTRIES_BY_REGION)) {
        const fallback = list.find(
          (x) => x.countryCode.toLowerCase() === urlCountry,
        );
        if (fallback) {
          setCurrentCountry({
            name: fallback.name,
            countryCode: fallback.countryCode,
            currencyKey: fallback.currencyKey,
          });
          const langId =
            LANGUAGE_CODE_TO_ID[urlLocale] ??
            LANGUAGE_CODE_TO_ID[fallback.lng];
          if (langId !== undefined) setLanguageId(langId);
          return;
        }
      }
    } else if (storeLocale !== urlLocale) {
      const langId = LANGUAGE_CODE_TO_ID[urlLocale];
      if (langId !== undefined) setLanguageId(langId);
    }
  }, [
    pathname,
    intlLocale,
    currentCountry.countryCode,
    languageId,
    setCurrentCountry,
    setLanguageId,
  ]);

  return null;
}
