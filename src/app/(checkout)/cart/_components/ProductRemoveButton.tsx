"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";

type Props = {
  id: number;
  size: string;
  index?: number;
};

export default function ProductRemoveButton({ id, size, index = 0 }: Props) {
  const { removeProduct, productToRemove, setProductToRemove } = useCart(
    (state) => state,
  );

  const isRemoveConfirmed =
    productToRemove &&
    productToRemove.id === id &&
    productToRemove.size === size &&
    productToRemove.index === index;

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent both event propagation and default link navigation
    event.preventDefault();
    event.stopPropagation();

    if (isRemoveConfirmed) {
      removeProduct(id, size, index);
      setProductToRemove(null);
    } else {
      setProductToRemove({ id, size, index });
    }
  };

  return (
    <>
      {isRemoveConfirmed && <Overlay color="dark" cover="container" />}
      <Button
        type="button"
        onClick={handleRemove}
        variant="underline"
        className={cn("uppercase", { "z-20": isRemoveConfirmed })}
      >
        {isRemoveConfirmed ? "sure?" : "remove"}
      </Button>
    </>
  );
}
