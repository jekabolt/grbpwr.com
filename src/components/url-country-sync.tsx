"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import {
  parseCountryLocalePath,
  parseLocaleOnlyPath,
} from "@/lib/middleware-utils";

/**
 * Syncs translations store with URL /{country}/{locale}: fixes stale country
 * and stale language when only the locale segment changes (e.g. fr/fr → fr/en).
 */
export function UrlCountrySync() {
  const pathname = usePathname();
  const { currentCountry, languageId, setCurrentCountry, setLanguageId } =
    useTranslationsStore((s) => s);

  useEffect(() => {
    const path = pathname ?? "";
    const parsed = parseCountryLocalePath(path);
    const localeOnly = !parsed?.country ? parseLocaleOnlyPath(path) : null;

    const urlCountry = parsed?.country?.toLowerCase();
    const urlLocale = parsed?.locale ?? localeOnly?.locale;
    if (!urlLocale) return;

    const urlLangId = LANGUAGE_CODE_TO_ID[urlLocale];
    if (urlLangId === undefined) return;

    // e.g. internal `/en/...` after rewrite — at least sync language id
    if (!urlCountry) {
      if (languageId !== urlLangId) {
        setLanguageId(urlLangId);
      }
      return;
    }

    const storeCountry = currentCountry.countryCode?.toLowerCase();

    // Same country: still align language with URL (persist/localStorage can keep old id)
    if (storeCountry === urlCountry) {
      if (languageId !== urlLangId) {
        setLanguageId(urlLangId);
      }
      return;
    }

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
          LANGUAGE_CODE_TO_ID[urlLocale] ?? LANGUAGE_CODE_TO_ID[fallback.lng];
        if (langId !== undefined) setLanguageId(langId);
        return;
      }
    }
  }, [
    pathname,
    currentCountry.countryCode,
    languageId,
    setCurrentCountry,
    setLanguageId,
  ]);

  return null;
}
