"use client";

import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import MobileCurrencyPopover from "./mobile-currency-popover";

interface Props {
  align?: "start" | "end";
  title?: string;
}

function Trigger({ defaultValue }: { defaultValue: string | undefined }) {
  return (
    <Text variant="uppercase">
      currency:{" "}
      <Text component="span" variant="inactive">
        {defaultValue}
      </Text>
    </Text>
  );
}

export default function CurrencyPopover({ align = "end", title }: Props) {
  const { selectedCurrency, rates, setSelectedCurrency } = useCurrency(
    (state) => state,
  );

  return (
    <>
      <div className="block lg:hidden">
        <MobileCurrencyPopover title={title} />
      </div>
      <div className="hidden lg:block">
        <GenericPopover
          title={title}
          openElement={
            <Trigger
              defaultValue={`${currencySymbols[selectedCurrency]} / ${selectedCurrency}`}
            />
          }
          className="border-inactive border"
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
              Object.entries(rates).map(([k, v]) => (
                <div key={k}>
                  <Button
                    onClick={() => {
                      setSelectedCurrency(k);
                    }}
                    className={cn("flex w-full lowercase", {
                      "underline underline-offset-2": k === selectedCurrency,
                    })}
                  >
                    <Text variant="inherit" className="block min-w-8 text-left">
                      {currencySymbols[k]} {v.description}
                    </Text>
                  </Button>
                </div>
              ))}
          </div>
        </GenericPopover>
      </div>
    </>
  );
}
