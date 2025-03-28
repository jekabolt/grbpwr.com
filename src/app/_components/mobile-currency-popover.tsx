"use client";

import { currencySymbols } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Props {
  title?: string;
  theme?: "light" | "dark";
}

export default function CurrencyPopover({ title, theme }: Props) {
  const { selectedCurrency, rates, setSelectedCurrency } = useCurrency(
    (state) => state,
  );

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase ">
          currency:{" "}
          <Text component="span" variant="inactive">
            {currencySymbols[selectedCurrency]} / {selectedCurrency}
          </Text>
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0" />
        <DialogPrimitives.Content
          className={cn(
            "fixed left-0 top-0 z-30 flex h-screen w-screen flex-col bg-bgColor p-2.5 text-textColor",
            {
              "blackTheme bg-bgColor text-textColor": theme === "dark",
            },
          )}
        >
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between p-2">
            <Text variant="uppercase">{title}</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="relative grow overflow-y-auto">
            <div className="space-y-2">
              {rates &&
                Object.entries(rates).map(([k, v]) => (
                  <div key={k}>
                    <Button
                      onClick={() => setSelectedCurrency(k)}
                      className={cn("flex w-full p-2 leading-none", {
                        "underline underline-offset-2": k === selectedCurrency,
                      })}
                    >
                      <Text
                        variant="inherit"
                        className="block min-w-8 text-left"
                      >
                        {currencySymbols[k]} {v.description}
                      </Text>
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
