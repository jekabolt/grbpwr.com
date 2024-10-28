"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";

export default function SelectedCurrency() {
  const { selectedCurrency } = useDataContext();
  const totalPrice = useCart((state) => state.totalPrice);

  return (
    <div className="flex justify-between text-textColor">
      <span>SUBTOTAL:</span>
      <span>
        {totalPrice} {selectedCurrency}
      </span>
    </div>
  );
}
