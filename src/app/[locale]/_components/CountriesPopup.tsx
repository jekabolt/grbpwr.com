"use client";

import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";

// Map language IDs to locale codes
const LANGUAGE_ID_TO_LOCALE: Record<number, string> = {
  1: "en",
  2: "fr",
  3: "de",
  4: "it",
  5: "ja",
  6: "cn",
  7: "kr",
};

export function CountriesPopup() {
  const router = useRouter();
  const pathname = usePathname();

  const { isOpen, selectedCurrency, closeCurrencyPopup, setSelectedCurrency } =
    useCurrency((state) => state);
  const {
    languageId,
    country: selectedCountry,
    setLanguageId,
    setCountry,
  } = useTranslationsStore((state) => state);

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

        // Remove current locale and optional country from the pathname
        const pathWithoutLocaleCountry =
          pathname
            // remove /{COUNTRY}/{locale}
            .replace(/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/, "")
            // remove /{locale}/{COUNTRY}
            .replace(/^\/[a-z]{2}\/[A-Za-z]{2}(?=\/|$)/, "")
            // remove /{locale}
            .replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

        // Country first, then locale
        const newPath = `/${country.countryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;

        // Navigate to new locale
        router.replace(newPath);
      }
    }

    closeCurrencyPopup();
  };
  return (
    <div>
      {/* {isOpen && (
        <Overlay
          cover="screen"
          onClick={closeCurrencyPopup}
          disablePointerEvents={false}
        />
      )} */}
      <div className="hidden lg:block">
        {isOpen && (
          <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[460px] bg-bgColor p-2.5 text-textColor">
            <div className="flex h-full flex-col gap-10">
              <div className="flex items-center justify-between">
                <Text variant="uppercase">change country</Text>
                <Button onClick={closeCurrencyPopup}>[x]</Button>
              </div>

              <div className="space-y-6">
                <Text>
                  prices will be shown in the local currency based on your
                  selection
                </Text>
                <Text>search bar</Text>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4 text-textColor">
                  {Object.entries(COUNTRIES_BY_REGION).map(
                    ([region, countries]) => (
                      <FieldsGroupContainer
                        key={region}
                        styling={{ sign: "plus-minus" }}
                        title={region}
                        isOpen
                      >
                        <div className="flex flex-col gap-2">
                          {countries.map((country) => (
                            <Button
                              key={`${region}-${country.name}-${country.lng}`}
                              className={cn(
                                "flex w-full items-center justify-between border-b border-transparent px-3",
                                {
                                  "border-textColor":
                                    country.currencyKey === selectedCurrency &&
                                    country.name === selectedCountry.name &&
                                    country.countryCode ===
                                      selectedCountry.countryCode &&
                                    LANGUAGE_CODE_TO_ID[country.lng] ===
                                      languageId,
                                },
                              )}
                              onClick={() => handleCountrySelect(country)}
                            >
                              <div className="flex items-center gap-2">
                                <Text>{country.name}</Text>
                                <Text>{`[${country.currency}]`}</Text>
                              </div>
                              <Text>{country.displayLng}</Text>
                            </Button>
                          ))}
                        </div>
                      </FieldsGroupContainer>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
