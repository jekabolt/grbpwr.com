"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
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
 */
export function UrlCountrySync() {
  const pathname = usePathname();
  const { currentCountry, languageId, setCurrentCountry, setLanguageId } =
    useTranslationsStore((s) => s);

  useEffect(() => {
    const parsed = parseCountryLocalePath(pathname ?? "");
    if (!parsed?.country || !parsed.locale) return;

    const urlCountry = parsed.country.toLowerCase();
    const urlLocale = parsed.locale;
    const storeCountry = currentCountry.countryCode?.toLowerCase();
    const storeLocale = LANGUAGE_ID_TO_LOCALE[languageId];

    // Country must match URL country; locale must match URL segment (/fr/en → store "en").
    // Previously we bailed when country matched, so /fr/en + store fr never updated languageId
    // (localStorage could stay French while next-intl used en, or UI stayed inconsistent).
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
