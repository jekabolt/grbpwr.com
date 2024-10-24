"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";
import GenericPopover from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Component() {
  const { rates, selectedCurrency, setSelectedCurrency } = useHeroContext();

  if (!rates?.currencies) return null;

  return (
    <GenericPopover
      title="currency"
      openElement={
        <span className="bg-textColor px-2 py-1 text-buttonTextColor">
          {`Currency: ${selectedCurrency}`}
        </span>
      }
    >
      <div className="space-y-2 px-12 pb-7">
        {Object.entries(rates.currencies).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setSelectedCurrency(k);
            }}
            className={cn("flex items-center gap-1 text-sm", {
              underline: k === selectedCurrency,
            })}
          >
            {v.description} {JSON.stringify(v.rate)}
          </button>
        ))}
      </div>
    </GenericPopover>
  );
}
