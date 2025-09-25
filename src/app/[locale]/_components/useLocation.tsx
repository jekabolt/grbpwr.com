"use client";

import { usePathname } from "next/navigation";
import {
  CountryOption,
  LANGUAGE_CODE_TO_ID,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";

export function useLocation({
  regionsWithCountries,
}: {
  regionsWithCountries?: [string, CountryOption[]][];
} = {}) {
  const pathname = usePathname();

  const {
    languageId,
    country: currentCountry,
    setCountry,
    setLanguageId,
  } = useTranslationsStore((state) => state);
  const { setSelectedCurrency, closeCurrencyPopup } = useCurrency(
    (state) => state,
  );

  const languagesForCurrentCountry = (() => {
    const langs: { label: string; value: string; className?: string }[] = [];
    for (const [, countries] of regionsWithCountries || []) {
      for (const c of countries) {
        if (c.countryCode === currentCountry.countryCode) {
          const isSelected = LANGUAGE_ID_TO_LOCALE[languageId] === c.lng;
          langs.push({
            label: c.displayLng || c.lng,
            value: c.lng,
            className: cn(
              "border border-textInactiveColorAlpha hover:border-textColor py-3 px-4",
              { "border-textColor": isSelected },
            ),
          });
        }
      }
    }

    const seen = new Set<string>();
    return langs.filter((l) => {
      if (seen.has(l.value)) return false;
      seen.add(l.value);
      return true;
    });
  })();

  const handleChangeLocaleOnly = (lng: string) => {
    const newLanguageId = LANGUAGE_CODE_TO_ID[lng];
    if (newLanguageId === undefined) return;
    setLanguageId(newLanguageId);

    const pathWithoutLocaleCountry =
      pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
      "/";

    const newPath = `/${currentCountry.countryCode.toLowerCase()}/${lng}${pathWithoutLocaleCountry}`;
    window.location.href = newPath;
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCurrency(country.currencyKey);
    setCountry({
      name: country.name,
      countryCode: country.countryCode,
    });

    // preserve current locale if set; otherwise fall back to country's default lng
    const currentLocale = LANGUAGE_ID_TO_LOCALE[languageId];
    const newLocale = currentLocale || country.lng;
    const maybeLanguageId = LANGUAGE_CODE_TO_ID[newLocale];
    if (maybeLanguageId !== undefined) {
      setLanguageId(maybeLanguageId);

      const pathWithoutLocaleCountry =
        pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
        "/";

      const newPath = `/${country.countryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
      window.location.href = newPath;
    }

    closeCurrencyPopup();
  };

  return {
    languagesForCurrentCountry,
    handleChangeLocaleOnly,
    handleCountrySelect,
  };
}
