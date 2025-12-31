"use client";

import { useState } from "react";
import {
  COUNTRIES_BY_REGION,
  currencySymbols,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RadioGroup from "@/components/ui/radio-group";
import { Searchbar } from "@/components/ui/searchbar";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";
import { useLocation } from "./useLocation";
import { useSearchCountries } from "./useSearchCountries";

export function MobileCountriesPopup() {
  const {
    isOpen,
    currentCountry,
    languageId,
    openCountryPopup,
    closeCountryPopup,
  } = useTranslationsStore((state) => state);
  const { query, filteredCountries, searchQuery, handleSearch } =
    useSearchCountries();

  const [openSection, setOpenSection] = useState<number | null>(null);
  const regionsWithCountries = Object.entries(COUNTRIES_BY_REGION);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;

  const {
    languagesForCurrentCountry,
    handleChangeLocaleOnly,
    handleCountrySelect,
  } = useLocation({
    regionsWithCountries,
  });

  const t = useTranslations("countries-popup");
  const f = useTranslations("footer");

  function toggleSection(index: number) {
    setOpenSection((prev) => (prev === index ? null : index));
  }

  return (
    <DialogPrimitives.Root open={open} onOpenChange={closeCountryPopup}>
      <Button
        onClick={openCountryPopup}
        className="flex w-full items-center justify-between uppercase lg:hidden"
      >
        <Text>{f("country")}:</Text>
        <Text>
          {currentCountry.name} /{" "}
          {currencySymbols[currentCountry.currencyKey || "EUR"]}
        </Text>
      </Button>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2 bottom-2 top-2 z-50 border border-textInactiveColor bg-bgColor p-2.5 text-textColor lg:hidden">
          <div className="flex items-center justify-between">
            <Text variant="uppercase">{t("change country")}</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>

          <div className="space-y-8">
            <Text className="uppercase">
              {t("text", {
                currentCountry: currentCountry.name,
                currency: currentCountry.currencyKey || "EUR",
              })}
            </Text>
            <div className="space-y-2.5 mb-4">
              <Text className="uppercase">{t("language")}</Text>
              {languagesForCurrentCountry &&
                languagesForCurrentCountry.length > 1 && (
                  <RadioGroup
                    items={languagesForCurrentCountry}
                    name="language-selector"
                    value={LANGUAGE_ID_TO_LOCALE[languageId]}
                    onValueChange={(val: string) => handleChangeLocaleOnly(val)}
                    className="flex flex-col gap-2 uppercase"
                  />
                )}
            </div>
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
                    className="flex w-full items-center justify-between px-3"
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
                    "border-b border-textInactiveColorAlpha hover:border-textColor",
                    {
                      "border-transparent hover:border-transparent":
                        index === regionsWithCountries.length - 1,
                    },
                  )}
                >
                  <FieldsGroupContainer
                    key={region}
                    signType="plus-minus"
                    clickableAreaClassName="h-9 items-start"
                    childrenSpacingClass="pb-4"
                    title={region}
                    isOpen={openSection === index}
                    onToggle={() => toggleSection(index)}
                  >
                    <div className="flex flex-col gap-2">
                      {countries.map((country) => (
                        <Button
                          key={`${region}-${country.name}-${country.lng}`}
                          className="flex w-full items-center justify-between px-3"
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
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
