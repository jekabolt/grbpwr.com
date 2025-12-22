"use client";

import { currencySymbols, getDisplayCurrencyKey } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import MobileCurrencyPopover from "./mobile-currency-popover";

interface Props {
  theme?: "light" | "dark";
  title?: string;
}

function Trigger({ defaultValue }: { defaultValue: string | undefined }) {
  return (
    <Text variant="uppercase" className="whitespace-nowrap">
      currency:{" "}
      <Text
        component="span"
        variant="inactive"
        className="inline-block min-w-16 text-left"
      >
        {defaultValue}
      </Text>
    </Text>
  );
}

export default function CurrencyPopover({ title, theme = "light" }: Props) {
  const { currentCountry, rates, setCurrentCountry } = useTranslationsStore(
    (state) => state,
  );

  return (
    <>
      <div className="block lg:hidden">
        <MobileCurrencyPopover theme={theme} />
      </div>
      <div className="hidden lg:block">
        <GenericPopover
          title={title}
          openElement={
            <Trigger
              defaultValue={`${currencySymbols[currentCountry.currencyKey || "EUR"]} / ${currentCountry.currencyKey || "EUR"}`}
            />
          }
          className={cn({
            "blackTheme bg-bgColor text-textColor": theme === "dark",
          })}
          contentProps={{
            align: "end",
            alignOffset: 10,
          }}
        >
          <div className="w-72 space-y-2">
            {rates &&
              Object.entries(rates).map(([k, v]) => {
                const displayKey = getDisplayCurrencyKey(k);
                return (
                  <div key={k}>
                    <Button
                      onClick={() => {
                        setCurrentCountry({ currencyKey: k });
                      }}
                      className={cn("flex w-full lowercase", {
                        "underline underline-offset-2":
                          k === currentCountry.currencyKey,
                      })}
                    >
                      <Text
                        variant="inherit"
                        className="block min-w-8 text-left"
                      >
                        {currencySymbols[displayKey]} {v.description}
                      </Text>
                    </Button>
                  </div>
                );
              })}
          </div>
        </GenericPopover>
      </div>
    </>
  );
}
