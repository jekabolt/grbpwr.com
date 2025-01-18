"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

export default function CartTotalPrice() {
  const { selectedCurrency } = useDataContext();
  const { subTotalPrice } = useCart((state) => state);

  return (
    <div className="flex items-center justify-between">
      <Text variant="uppercase">subtotal:</Text>
      <Text variant="uppercase">
        {subTotalPrice} {selectedCurrency}
      </Text>
    </div>
  );
}
