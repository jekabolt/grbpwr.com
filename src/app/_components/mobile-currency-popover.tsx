"use client";

import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { currencySymbols } from "./currency-popover";

// ... keep currencySymbols object as is ...

interface Props {
  title?: string;
}

export default function CurrencyPopover({ title }: Props) {
  const { rates, selectedCurrency, setSelectedCurrency } = useDataContext();

  if (!rates?.currencies) return null;

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button size="sm" variant="simple" className="uppercase">
          {`Currency: ${currencySymbols[selectedCurrency]}`}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-black" />
        <DialogPrimitives.Content className="blackTheme fixed left-0 top-0 z-20 flex h-screen w-screen flex-col p-2.5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between p-2">
            <Text variant="uppercase">{title}</Text>
            <DialogPrimitives.Close asChild>
              <Button className="bg-black text-textColor">[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="relative grow overflow-y-auto">
            <div className="space-y-2">
              {Object.entries(rates.currencies).map(([k, v]) => (
                <div
                  className={cn("leading-none", {
                    "bg-bgColor text-textColor": k === selectedCurrency,
                  })}
                  key={k}
                >
                  <Button
                    onClick={() => setSelectedCurrency(k)}
                    className="flex w-full p-2 text-white"
                  >
                    <Text component="span" className="block min-w-8 text-left">
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
