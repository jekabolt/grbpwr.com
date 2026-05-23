"use client";

import { usePathname } from "next/navigation";
import {
  CountryOption,
  LANGUAGE_CODE_TO_ID,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";

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
    closeCountryPopup();

    const country = currentCountry.countryCode?.toLowerCase();
    if (!country) return;

    const stripped =
      pathname.replace(/^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/, "") ||
      "";
    const rest = stripped === "/" ? "" : stripped;
    const url = new URL(
      `/${country}/${lng}${rest}`,
      window.location.origin,
    );
    const existing =
      typeof window !== "undefined" ? window.location.search : "";
    if (existing) {
      const existingParams = new URLSearchParams(existing);
      existingParams.forEach((value, key) => {
        if (key !== "from_picker") url.searchParams.set(key, value);
      });
    }
    url.searchParams.set("from_picker", "1");

    if (typeof document !== "undefined") {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `NEXT_COUNTRY=${country}; Path=/; Max-Age=${oneYear}; SameSite=Lax${secure}`;
      document.cookie = `NEXT_LOCALE=${lng}; Path=/; Max-Age=${oneYear}; SameSite=Lax${secure}`;
    }

    window.location.href = url.toString();
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
