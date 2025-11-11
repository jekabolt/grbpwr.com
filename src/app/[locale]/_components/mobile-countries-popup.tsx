"use client";

import { useState } from "react";
import {
  COUNTRIES_BY_REGION,
  currencySymbols,
  LANGUAGE_ID_TO_LOCALE,
} from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogBackgroundManager } from "@/components/ui/dialog-background-manager";
import RadioGroup from "@/components/ui/radio-group";
import { Searchbar } from "@/components/ui/searchbar";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "../(checkout)/checkout/_components/new-order-form/fields-group-container";
import { useLocation } from "./useLocation";
import { useSearchCountries } from "./useSearchCountries";

export function MobileCountriesPopup() {
  const { isOpen, selectedCurrency, closeCurrencyPopup, openCurrencyPopup } =
    useCurrency((s) => s);
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
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
    <>
      <DialogBackgroundManager isOpen={open} backgroundColor="#000000" />
      <DialogPrimitives.Root open={open} onOpenChange={closeCurrencyPopup}>
        <Button
          onClick={openCurrencyPopup}
          className="flex w-full items-center justify-between uppercase lg:hidden"
        >
          <Text>{f("country")}:</Text>
          <Text>
            {currentCountry.name} / {currencySymbols[selectedCurrency]}
          </Text>
        </Button>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-black" />
          <DialogPrimitives.Content className="blackTheme fixed inset-0 z-50 h-dvh bg-bgColor p-2.5 text-textColor lg:hidden">
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

              <div className="space-y-8">
                <Text className="uppercase">
                  {t("text", {
                    currentCountry: currentCountry.name,
                    currency: selectedCurrency,
                  })}
                </Text>
                <div className="space-y-2.5">
                  <Text className="uppercase">{t("language")}</Text>
                  {languagesForCurrentCountry &&
                    languagesForCurrentCountry.length > 1 && (
                      <RadioGroup
                        items={languagesForCurrentCountry}
                        name="language-selector"
                        value={LANGUAGE_ID_TO_LOCALE[languageId]}
                        onValueChange={(val: string) =>
                          handleChangeLocaleOnly(val)
                        }
                        className="flex flex-col gap-0 uppercase"
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
                        styling={{
                          sign: "plus-minus",
                          clickableArea: "full",
                          clickableAreaClassName: "h-9 items-start",
                          childrenSpacing: "pb-4",
                        }}
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
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </>
  );
}
