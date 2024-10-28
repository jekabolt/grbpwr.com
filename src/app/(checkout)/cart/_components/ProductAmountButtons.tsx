"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  size: string;
  children: React.ReactNode;
};

export default function ProductAmountButtons({ id, size, children }: Props) {
  const { increaseQuantity, decreaseQuantity } = useCart((state) => state);

  return (
    <div className="flex gap-1">
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          increaseQuantity(id, size);
        }}
      >
        +
      </Button>
      {children}
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          decreaseQuantity(id, size);
        }}
      >
        -
      </Button>
    </div>
  );
}
