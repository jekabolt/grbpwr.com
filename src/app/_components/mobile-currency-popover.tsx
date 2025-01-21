"use client";

import { currencySymbols } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Props {
  title?: string;
}

export default function CurrencyPopover({ title }: Props) {
  const { rates } = useDataContext();
  const { selectedCurrency, setSelectedCurrency } = useCurrency(
    (state) => state,
  );

  if (!rates?.currencies) return null;

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button size="sm" className="uppercase">
          {`Currency: ${selectedCurrency}`}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0" />
        <DialogPrimitives.Content className="blackTheme fixed left-0 top-0 z-30 flex h-screen w-screen flex-col bg-bgColor p-2.5 text-textColor">
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
              {Object.entries(rates.currencies).map(([k, v]) => (
                <div
                  className={cn("leading-none", {
                    "bg-textColor text-bgColor": k === selectedCurrency,
                  })}
                  key={k}
                >
                  <Button
                    onClick={() => setSelectedCurrency(k)}
                    className="flex w-full p-2"
                  >
                    <Text variant="inherit" className="block min-w-8 text-left">
                      {currencySymbols[k]}
                    </Text>
                    {v.description}
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
