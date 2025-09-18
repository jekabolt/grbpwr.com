"use client";

import { usePathname, useRouter } from "next/navigation";
import { LANGUAGE_CODE_TO_ID } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

const LANGUAGE_ID_TO_LOCALE: Record<number, string> = {
  1: "en",
  2: "fr",
  3: "de",
  4: "it",
  5: "ja",
  6: "cn",
  7: "kr",
};

export function useLocation() {
  const router = useRouter();
  const pathname = usePathname();

  const { setCountry, setLanguageId } = useTranslationsStore((state) => state);
  const { setSelectedCurrency, closeCurrencyPopup } = useCurrency(
    (state) => state,
  );

  const handleCountrySelect = (country: any) => {
    setSelectedCurrency(country.currencyKey);
    setCountry({
      name: country.name,
      countryCode: country.countryCode,
    });

    const newLanguageId = LANGUAGE_CODE_TO_ID[country.lng];
    if (newLanguageId !== undefined) {
      setLanguageId(newLanguageId);

      // Get the new locale code
      const newLocale = LANGUAGE_ID_TO_LOCALE[newLanguageId];
      if (newLocale) {
        // Persist preference so middleware respects it
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + oneYear).toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale}; Path=/; Expires=${expires}`;

        // The pathname from usePathname() is already stripped of locale by Next.js
        // So we just need to add the locale prefix
        const pathWithoutLocale = pathname === "/" ? "" : pathname;
        const newPath = `/${newLocale}${pathWithoutLocale}`;

        router.replace(newPath);
      }
    }

    closeCurrencyPopup();
  };

  return {
    handleCountrySelect,
  };
}
