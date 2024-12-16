"use client";

import { useState } from "react";
import type {
  common_ProductSize,
  common_SizeEnum,
} from "@/api/proto-http/frontend";
import { SIZE_NAME_MAP } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";

export function AddToCartForm({ sizes, id, className }: Props) {
  const { increaseQuantity, products } = useCart((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const { dictionary } = useDataContext();

  const sizeNames = sizes.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)
      ?.name as common_SizeEnum,
  }));

  const productQuanityInCart = products.find(
    (p) => p.id === id && p.size === activeSizeId?.toString(),
  )?.quantity;

  const isMaxQuantity =
    productQuanityInCart &&
    productQuanityInCart >= (dictionary?.maxOrderItems || 3);

  const handleAddToCart = async () => {
    if (!activeSizeId || isMaxQuantity) return;

    await increaseQuantity(id, activeSizeId?.toString() || "", 1);
  };

  return (
    <div className={cn(className)}>
      <div className="flex w-full grow justify-between">
        {sizeNames.map(({ name, id }) => (
          <Button
            className={cn("p-1", {
              "bg-textColor text-bgColor": activeSizeId === id,
            })}
            key={id}
            onClick={() => setActiveSizeId(id)}
          >
            {SIZE_NAME_MAP[name]}
          </Button>
        ))}
      </div>
      <Button
        className="w-full"
        variant="main"
        size="lg"
        disabled={!activeSizeId || isMaxQuantity}
        onClick={handleAddToCart}
      >
        ADD TO CARD
      </Button>
    </div>
  );
}

interface Props {
  id: number;
  sizes: common_ProductSize[];
  className?: string;
}
