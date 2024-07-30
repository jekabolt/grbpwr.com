"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";

export default function SelectedCurrency({
  baseCurrencyTotal,
}: {
  baseCurrencyTotal: number;
}) {
  const { selectedCurrency } = useHeroContext();

  return (
    <div>
      <div>total</div>
      <div> base currency: {baseCurrencyTotal}</div>
      <div>
        todo: convert to {selectedCurrency}: {baseCurrencyTotal}
      </div>
    </div>
  );
}
