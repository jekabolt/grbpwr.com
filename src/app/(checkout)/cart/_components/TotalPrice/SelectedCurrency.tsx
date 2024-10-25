"use client";

import { useDataContext } from "@/components/DataContext";

export default function SelectedCurrency({
  baseCurrencyTotal,
}: {
  baseCurrencyTotal: number;
}) {
  const { selectedCurrency } = useDataContext();

  return (
    <div className="flex justify-between text-textColor">
      <span>SUBTOTAL:</span>
      <span>
        {selectedCurrency} {baseCurrencyTotal}
      </span>
    </div>
  );
}
