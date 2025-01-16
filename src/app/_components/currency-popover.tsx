"use client";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import MobileCurrencyPopover from "./mobile-currency-popover";

export const currencySymbols: Record<string, string> = {
  Bitcoin: "₿", // Bitcoin
  CHF: "Fr", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  CZK: "Kč", // Czech Republic Koruna
  DKK: "kr", // Danish Krone
  EUR: "€", // Euro
  Ethereum: "Ξ", // Ethereum
  GBP: "£", // British Pound Sterling
  GEL: "₾", // Georgian Lari
  HKD: "$", // Hong Kong Dollar
  HUF: "Ft", // Hungarian Forint
  ILS: "₪", // Israeli New Sheqel
  JPY: "¥", // Japanese Yen
  NOK: "kr", // Norwegian Krone
  PLN: "zł", // Polish Zloty
  RUB: "₽", // Russian Ruble
  SEK: "kr", // Swedish Krona
  SGD: "$", // Singapore Dollar
  TRY: "₺", // Turkish Lira
  UAH: "₴", // Ukrainian Hryvnia
  USD: "$", // United States Dollar
};

interface Props {
  align?: "start" | "end";
  title?: string;
}

function Trigger({ defaultValue }: { defaultValue: string | undefined }) {
  return (
    <Text variant="uppercase">
      currency{" "}
      <Text component="span" variant="inactive">
        {defaultValue}
      </Text>
    </Text>
  );
}

export default function CurrencyPopover({ align = "end", title }: Props) {
  const { rates, selectedCurrency, setSelectedCurrency } = useDataContext();

  if (!rates?.currencies) return null;

  return (
    <>
      <div className="block lg:hidden">
        <MobileCurrencyPopover title={title} />
      </div>
      <div className="hidden lg:block">
        <GenericPopover
          title={title}
          openElement={
            <Trigger defaultValue={currencySymbols[selectedCurrency]} />
          }
          className="border border-white"
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
            {Object.entries(rates.currencies).map(([k, v]) => (
              <div
                className={cn("leading-none", {
                  "bg-textColor text-bgColor": k === selectedCurrency,
                })}
                key={k}
              >
                <Button
                  onClick={() => {
                    setSelectedCurrency(k);
                  }}
                  className="flex w-full"
                >
                  <Text variant="inherit" className="block min-w-8 text-left">
                    {currencySymbols[k]}
                  </Text>
                  {v.description}
                </Button>
              </div>
            ))}
          </div>
        </GenericPopover>
      </div>
    </>
  );
}
