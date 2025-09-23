import {
  COUNTRIES_BY_REGION,
  currencySymbols,
  LANGUAGE_CODE_TO_ID,
} from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Searchbar } from "@/components/ui/searchbar";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";
import { useLocation } from "./useLocation";
import { useSearchCountries } from "./useSearchCountries";

export function MobileCountriesPopup() {
  const { isOpen, selectedCurrency, closeCurrencyPopup, openCurrencyPopup } =
    useCurrency((state) => state);
  const { languageId, country: selectedCountry } = useTranslationsStore(
    (state) => state,
  );
  const { handleCountrySelect } = useLocation();

  const { query, filteredCountries, searchQuery, handleSearch } =
    useSearchCountries();

  const regionsWithCountries = Object.entries(COUNTRIES_BY_REGION);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;

  const t = useTranslations("countries-popup");
  const f = useTranslations("footer");

  return (
    <DialogPrimitives.Root open={open} onOpenChange={closeCurrencyPopup}>
      <Button
        onClick={openCurrencyPopup}
        className="flex w-full items-center justify-between border border-textColor uppercase lg:hidden"
      >
        <Text>{f("country")}:</Text>
        <Text>
          {selectedCountry.name} / {currencySymbols[selectedCurrency]}
        </Text>
      </Button>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-overlay opacity-40" />
        <DialogPrimitives.Content className="blackTheme fixed inset-0 z-50 h-screen w-screen bg-bgColor p-2.5 text-textColor lg:hidden">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full w-full flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{t("change country")}</Text>
              <DialogPrimitives.Close asChild>
                <Button>[x]</Button>
              </DialogPrimitives.Close>
            </div>

            <div className="space-y-6">
              <Text>{t("text")}</Text>
              <Searchbar
                name="search"
                value={query}
                noFound={filteredCountries.length === 0}
                handleSearch={handleSearch}
                placeholder={t("search location")}
              />
            </div>

            <div className="space-y-4 text-textColor">
              {searchQuery ? (
                <div className="flex flex-col gap-2">
                  {filteredCountries.map((country) => (
                    <Button
                      key={`${country.countryCode}-${country.name}-${country.lng}`}
                      className={cn(
                        "flex w-full items-center justify-between border-b border-transparent px-3",
                        {
                          "border-textColor":
                            country.currencyKey === selectedCurrency &&
                            country.name === selectedCountry.name &&
                            country.countryCode ===
                              selectedCountry.countryCode &&
                            LANGUAGE_CODE_TO_ID[country.lng] === languageId,
                        },
                      )}
                      onClick={() => handleCountrySelect(country)}
                    >
                      <div className="flex items-center gap-2">
                        <Text className="uppercase">{country.name}</Text>
                        <Text>{`[${country.currency}]`}</Text>
                      </div>
                      <Text className="uppercase">{country.displayLng}</Text>
                    </Button>
                  ))}
                </div>
              ) : (
                regionsWithCountries.map(([region, countries], index) => (
                  <div
                    key={region}
                    className={cn(
                      "border-textInactiveColorAlpha border-b hover:border-textColor",
                      {
                        "border-transparent hover:border-transparent":
                          index === regionsWithCountries.length - 1,
                      },
                    )}
                  >
                    <FieldsGroupContainer
                      key={region}
                      styling={{
                        sign: "plus-minus",
                        clickableArea: "full",
                        clickableAreaClassName: "h-9 items-start",
                      }}
                      title={region}
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
                              <Text className="uppercase">{country.name}</Text>
                              <Text>{`[${country.currency}]`}</Text>
                            </div>
                            <Text className="uppercase">
                              {country.displayLng}
                            </Text>
                          </Button>
                        ))}
                      </div>
                    </FieldsGroupContainer>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
