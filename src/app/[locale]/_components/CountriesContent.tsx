"use client";

import { useState } from "react";
import { COUNTRIES_BY_REGION, LANGUAGE_ID_TO_LOCALE } from "@/constants";
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

export function CountriesContent({ className }: { className?: string }) {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const regionsWithCountries = Object.entries(COUNTRIES_BY_REGION);
  const t = useTranslations("countries-popup");

  const { filteredCountries, query, searchQuery, handleSearch } =
    useSearchCountries();
  const { currentCountry, languageId, closeCountryPopup } =
    useTranslationsStore((s) => s);
  const {
    languagesForCurrentCountry,
    handleChangeLocaleOnly,
    handleCountrySelect,
  } = useLocation({
    regionsWithCountries,
  });

  function toggleSection(index: number) {
    setOpenSection((prev) => (prev === index ? null : index));
  }

  return (
    <div className={cn("flex h-full flex-col justify-between", className)}>
      <div className="space-y-10 overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between bg-bgColor">
          <Text variant="uppercase">{t("change country")}</Text>
          <Button onClick={closeCountryPopup}>[x]</Button>
        </div>

        <div className="space-y-8">
          <Text className="uppercase">
            {t("text", {
              currentCountry: currentCountry.name,
              currency: currentCountry.currencyKey || "",
            })}
          </Text>
          {languagesForCurrentCountry &&
            languagesForCurrentCountry.length > 1 && (
              <div className="mb-4 space-y-2.5">
                <Text className="uppercase">{t("language")}</Text>
                <RadioGroup
                  items={languagesForCurrentCountry.map((item, index) => {
                    const isSelected =
                      item.value === LANGUAGE_ID_TO_LOCALE[languageId];
                    const borderColor = isSelected
                      ? "border-textColor"
                      : "border-textInactiveColor";
                    return {
                      ...item,
                      className: cn(
                        item.className,
                        index === 0 && `border ${borderColor}`,
                        index === 1 &&
                          `border-t border-x border-b ${borderColor}`,
                      ),
                    };
                  })}
                  name="language-selector"
                  value={LANGUAGE_ID_TO_LOCALE[languageId]}
                  onValueChange={(val: string) => handleChangeLocaleOnly(val)}
                  className="gap-2 uppercase lg:grid lg:grid-cols-1"
                />
              </div>
            )}
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
                  className="flex w-full items-center justify-between px-4"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center gap-3">
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
                  headerContentGapClass="space-y-2 lg:space-y-1"
                  title={region}
                  isOpen={openSection === index}
                  onToggle={() => toggleSection(index)}
                >
                  <div className="flex flex-col gap-2">
                    {countries.map((country) => (
                      <Button
                        key={`${region}-${country.name}-${country.lng}`}
                        className="group flex w-full items-center justify-between px-4"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <div className="flex min-w-0 flex-1 items-center justify-between border-b border-transparent group-hover:border-textColor">
                          <div className="flex items-center gap-2">
                            <Text className="uppercase">{country.name}</Text>
                            <Text>{`[${country.currency}]`}</Text>
                          </div>
                          <Text className="uppercase">{country.displayLng}</Text>
                        </div>
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
  );
}
