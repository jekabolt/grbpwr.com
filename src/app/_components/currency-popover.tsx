"use client";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";

export default function Component() {
  const { rates, selectedCurrency, setSelectedCurrency } = useDataContext();

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
