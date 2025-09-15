import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/(checkout)/checkout/_components/new-order-form/fields-group-container";

export function CountriesPopup() {
  const { isOpen, selectedCurrency, closeCurrencyPopup, setSelectedCurrency } =
    useCurrency((state) => state);
  const {
    languageId,
    country: selectedCountry,
    setLanguageId,
    setCountry,
  } = useTranslationsStore((state) => state);
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
                              onClick={() => {
                                setSelectedCurrency(country.currencyKey);
                                setCountry({
                                  name: country.name,
                                  countryCode: country.countryCode,
                                });
                                const newLanguageId =
                                  LANGUAGE_CODE_TO_ID[country.lng];
                                if (newLanguageId !== undefined) {
                                  setLanguageId(newLanguageId);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Text>{country.name}</Text>
                                <Text>{`[${country.currency}]`}</Text>
                              </div>
                              <Text>
                                {(country as any).displayLng || country.lng}
                              </Text>
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
