"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";

export default function CartTotalPrice() {
  const { selectedCurrency } = useDataContext();
  const { totalPrice, subTotalPrice } = useCart((state) => state);

  return (
    <div className="border-t border-dashed border-textColor pt-6 text-textColor">
      <div className="flex justify-between">
        <span>TOTAL:</span>
        <span>
          {totalPrice} {selectedCurrency}
        </span>
      </div>
      <div className="flex justify-between">
        <span>SUBTOTAL:</span>
        <span>
          {subTotalPrice} {selectedCurrency}
        </span>
      </div>
    </div>
  );
}
