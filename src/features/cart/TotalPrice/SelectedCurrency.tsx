"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";

export default function SelectedCurrency({
  baseCurrencyTotal,
}: {
  baseCurrencyTotal: number;
}) {
  const { selectedCurrency } = useHeroContext();

  return (
    <div className="flex justify-between text-textColor">
      <span>SUBTOTAL:</span>
      <span>
        {selectedCurrency} {baseCurrencyTotal}
      </span>
    </div>
  );
}
