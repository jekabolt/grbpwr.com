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
        // Remove current locale and optional country from the pathname
        // Handle patterns like: /ja/ja, /us/en, /en, etc.
        const pathWithoutLocaleCountry =
          pathname.replace(
            /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/,
            "",
          ) || "/";

        const newPath = `/${country.countryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;

        console.log("Navigating from:", pathname, "to:", newPath);

        // Use window.location for full page navigation to ensure middleware processes the URL
        window.location.href = newPath;
      }
    }

    closeCurrencyPopup();
  };

  return {
    handleCountrySelect,
  };
}
