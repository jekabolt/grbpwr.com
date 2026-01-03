"use client";

import { currencySymbols, getDisplayCurrencyKey } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Props {
  theme?: "light" | "dark";
}

export default function MobileCurrencyPopover({ theme }: Props) {
  const { currentCountry, rates, setCurrentCountry } = useTranslationsStore(
    (state) => state,
  );
  const tAccessibility = useTranslations("accessibility");

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button className="flex w-full items-center justify-between uppercase">
          <Text component="span" variant="uppercase">
            currency:
          </Text>
          <Text component="span" variant="inactive">
            {
              currencySymbols[
                getDisplayCurrencyKey(currentCountry.currencyKey || "EUR")
              ]
            }{" "}
            / {getDisplayCurrencyKey(currentCountry.currencyKey || "EUR")}
          </Text>
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitives.Content
          className={cn(
            "fixed inset-0 z-50 flex h-dvh flex-col bg-bgColor p-2.5 text-textColor",
            {
              "blackTheme bg-bgColor text-textColor": theme === "dark",
            },
          )}
        >
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between p-2.5">
            <Text variant="uppercase">currency:</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="relative grow overflow-y-auto">
            <div className="space-y-4 px-2.5">
              {rates &&
                Object.entries(rates).map(([k, v]) => {
                  const displayKey = getDisplayCurrencyKey(k);
                  return (
                    <div className="w-full" key={k}>
                      <Button
                        onClick={() => setCurrentCountry({ currencyKey: k })}
                        className={cn(
                          "relative flex w-full py-2 leading-none",
                          {
                            "after:absolute after:bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-current":
                              k === currentCountry.currencyKey,
                          },
                        )}
                      >
                        {currencySymbols[displayKey]} {displayKey}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
