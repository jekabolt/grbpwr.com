"use client";

import { currencySymbols, getDisplayCurrencyKey } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import MobileCurrencyPopover from "./mobile-currency-popover";

interface Props {
  align?: "start" | "end";
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

export default function CurrencyPopover({
  align = "end",
  title,
  theme = "light",
}: Props) {
  const { selectedCurrency, rates, setSelectedCurrency } = useCurrency(
    (state) => state,
  );

  return (
    <>
      <div className="block w-full lg:hidden">
        <MobileCurrencyPopover title={title} theme={theme} />
      </div>
      <div className="hidden lg:block">
        <GenericPopover
          title={title}
          openElement={
            <Trigger
              defaultValue={`${currencySymbols[getDisplayCurrencyKey(selectedCurrency)]} / ${getDisplayCurrencyKey(selectedCurrency)}`}
            />
          }
          className={cn("border-inactive border", {
            "blackTheme bg-bgColor text-textColor": theme === "dark",
          })}
          variant="currency"
          contentProps={{
            sideOffset: title ? -25 : 16,
            align: align,
          }}
        >
          <div
            className={cn("space-y-2", {
              "min-w-80": !title,
              "w-full": title,
            })}
          >
            {rates &&
              Object.entries(rates).map(([k, v]) => {
                const displayKey = getDisplayCurrencyKey(k);
                return (
                  <div key={k}>
                    <Button
                      onClick={() => {
                        setSelectedCurrency(k);
                      }}
                      className={cn("flex w-full lowercase", {
                        "underline underline-offset-2": k === selectedCurrency,
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
