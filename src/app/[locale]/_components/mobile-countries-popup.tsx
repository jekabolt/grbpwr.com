"use client";

import { useState } from "react";
import {
  COUNTRIES_BY_REGION,
  CountryOption,
  currencySymbols,
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
import { useSearchCountries } from "./useSearchCountries";

export function MobileCountriesPopup({
  onCountrySelect,
}: {
  onCountrySelect: (location: CountryOption) => void;
}) {
  const { isOpen, selectedCurrency, closeCurrencyPopup, openCurrencyPopup } =
    useCurrency((state) => state);
  const { country: selectedCountry } = useTranslationsStore((state) => state);
  const { query, filteredCountries, searchQuery, handleSearch } =
    useSearchCountries();

  const [openSection, setOpenSection] = useState<number | null>(null);
  const regionsWithCountries = Object.entries(COUNTRIES_BY_REGION);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;

  const t = useTranslations("countries-popup");
  const f = useTranslations("footer");

  function toggleSection(index: number) {
    setOpenSection((prev) => (prev === index ? null : index));
  }

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
              <Text className="uppercase">
                {t("text", {
                  currentCountry: selectedCountry.name,
                  currency: selectedCurrency,
                })}
              </Text>
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
                      onClick={() => onCountrySelect(country)}
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
                            onClick={() => onCountrySelect(country)}
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
