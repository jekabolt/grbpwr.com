"use client";

import { useState } from "react";
import {
  COUNTRIES_BY_REGION,
  CountryOption,
  LANGUAGE_CODE_TO_ID,
} from "@/constants";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Searchbar } from "@/components/ui/searchbar";
import { Text } from "@/components/ui/text";
import { UpdateLocation } from "@/components/ui/update-location";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";
import { MobileCountriesPopup } from "./mobile-countries-popup";
import { useSearchCountries } from "./useSearchCountries";

export function CountriesPopup() {
  const [seletedLocation, setSeletedLocation] = useState<CountryOption>();
  const { isOpen, closeCurrencyPopup } = useCurrency((state) => state);

  const { country: currentCountry } = useTranslationsStore((state) => state);

  const { query, filteredCountries, searchQuery, handleSearch } =
    useSearchCountries();

  const regionsWithCountries = Object.entries(COUNTRIES_BY_REGION);

  const t = useTranslations("countries-popup");

  function handleSelection(location: CountryOption) {
    setSeletedLocation(location);
    closeCurrencyPopup();
  }

  function cancelSelection() {
    setSeletedLocation(undefined);
  }

  return (
    <>
      <MobileCountriesPopup />
      <div className="hidden lg:block">
        {isOpen && (
          <>
            <Overlay
              cover="screen"
              onClick={closeCurrencyPopup}
              disablePointerEvents={false}
            />

            <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[460px] bg-bgColor p-2.5 text-textColor">
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-10 overflow-y-auto">
                  <div className="sticky top-0 flex items-center justify-between bg-bgColor">
                    <Text variant="uppercase">{t("change country")}</Text>
                    <Button onClick={closeCurrencyPopup}>[x]</Button>
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

                  {/* <div className="flex-1 overflow-y-auto"> */}
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
                                  country.currencyKey ===
                                    seletedLocation?.currencyKey &&
                                  country.name === seletedLocation?.name &&
                                  country.countryCode ===
                                    seletedLocation?.countryCode &&
                                  LANGUAGE_CODE_TO_ID[country.lng] ===
                                    LANGUAGE_CODE_TO_ID[seletedLocation?.lng],
                              },
                            )}
                            onClick={() => handleSelection(country)}
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
                    ) : (
                      regionsWithCountries.map(([region, countries], index) => (
                        <div
                          key={region}
                          className={cn(
                            "border-b border-textInactiveColor hover:border-textColor",
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
                                        country.currencyKey ===
                                          seletedLocation?.currencyKey &&
                                        country.name ===
                                          seletedLocation?.name &&
                                        country.countryCode ===
                                          seletedLocation?.countryCode &&
                                        LANGUAGE_CODE_TO_ID[country.lng] ===
                                          LANGUAGE_CODE_TO_ID[
                                            seletedLocation?.lng
                                          ],
                                    },
                                  )}
                                  onClick={() => handleSelection(country)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Text className="uppercase">
                                      {country.name}
                                    </Text>
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
              </div>
            </div>
          </>
        )}
        {seletedLocation && (
          <UpdateLocation
            selectedLocation={seletedLocation}
            currentCountry={currentCountry?.name || ""}
            onCancel={cancelSelection}
          />
        )}
      </div>
    </>
  );
}
