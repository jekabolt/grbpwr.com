import { buildCountryStatesCurrencyMapAllVariants } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/(checkout)/checkout/_components/new-order-form/fields-group-container";

export function CountriesPopup() {
  const {
    isOpen,
    closeCurrencyPopup,
    setSelectedCurrency,
    setSelectedLanguage,
  } = useCurrency((state) => state);
  const regions = buildCountryStatesCurrencyMapAllVariants();
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
                  {Object.entries(regions).map(([region, countries]) => (
                    <FieldsGroupContainer
                      key={region}
                      styling={{ sign: "plus-minus" }}
                      title={region}
                      isOpen
                    >
                      <div className="flex flex-col gap-2">
                        {countries.map((c) => (
                          <Button
                            key={`${region}-${c.label}-${c.lng}`}
                            className="flex w-full items-center justify-between px-3"
                            onClick={() => {
                              if (c.currencyKey)
                                setSelectedCurrency(c.currencyKey);
                              setSelectedLanguage({
                                code: c.lngCode || "en",
                                id: c.lngId || 0,
                              });
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Text>{c.label}</Text>
                              <Text>{`[${c.currency}]`}</Text>
                            </div>
                            <Text>{c.lng}</Text>
                          </Button>
                        ))}
                      </div>
                    </FieldsGroupContainer>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
