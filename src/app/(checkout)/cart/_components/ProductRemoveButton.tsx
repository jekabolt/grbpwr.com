"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  size: string;
};

export default function ProductRemoveButton({ id, size }: Props) {
  const { removeProduct } = useCart((state) => state);

  return (
    <Button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        removeProduct(id, size);
      }}
      variant="underline"
    >
      remove
    </Button>
  );
}
