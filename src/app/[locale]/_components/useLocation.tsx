"use client";

import { usePathname } from "next/navigation";
import {
  CountryOption,
  LANGUAGE_CODE_TO_ID,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";

import { navigateToLocaleWithPicker } from "@/lib/navigation/navigate-with-picker";
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
    currentCountry,
    setNextCountry,
    setLanguageId,
    closeCountryPopup,
  } = useTranslationsStore((state) => state);

  const languagesForCurrentCountry = (() => {
    const langs: { label: string; value: string; className?: string }[] = [];
    for (const [, countries] of regionsWithCountries || []) {
      for (const c of countries) {
        if (
          c.countryCode.toLowerCase() ===
          currentCountry.countryCode?.toLowerCase()
        ) {
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
    closeCountryPopup();

    navigateToLocaleWithPicker(lng, pathname, currentCountry.countryCode);
  };

  const handleCountrySelect = (country: any) => {
    setNextCountry({
      name: country.name,
      countryCode: country.countryCode,
      currencyKey: country.currencyKey,
      localeCode: country.lng,
    });

    closeCountryPopup();
  };

  return {
    languagesForCurrentCountry,
    handleChangeLocaleOnly,
    handleCountrySelect,
  };
}
