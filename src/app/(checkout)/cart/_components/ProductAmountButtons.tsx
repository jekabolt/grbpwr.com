"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  size: string;
  quantity: number;
};

export default function ProductAmountButtons({ id, size, quantity }: Props) {
  const { dictionary } = useDataContext();
  const { increaseQuantity, decreaseQuantity } = useCart((state) => state);
  const isMaxQuantity = quantity >= (dictionary?.maxOrderItems || 3);

  return (
    <div className="flex gap-1">
      <Button
        onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
          await increaseQuantity(id, size);
        }}
        disabled={isMaxQuantity}
      >
        +
      </Button>
      {quantity}
      <Button
        onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
          await decreaseQuantity(id, size);
        }}
      >
        -
      </Button>
    </div>
  );
}
