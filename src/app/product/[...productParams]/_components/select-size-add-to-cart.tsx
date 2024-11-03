"use client";

import { useState } from "react";
import type {
  common_ProductSize,
  common_SizeEnum,
} from "@/api/proto-http/frontend";
import { SIZE_NAME_MAP } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";

export default function AddToCartForm({
  sizes,
  id,
}: {
  id: number;
  sizes: common_ProductSize[];
}) {
  const { increaseQuantity, products } = useCart((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | null>(
    sizes[0].sizeId as number,
  );
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
    if (isMaxQuantity) return;

    await increaseQuantity(id, activeSizeId?.toString() || "", 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-10">
        {sizeNames.map(({ name, id }, i) => (
          <Button
            variant={activeSizeId === id ? "underline" : "default"}
            key={id}
            onClick={() => setActiveSizeId(id)}
          >
            {SIZE_NAME_MAP[name]}
          </Button>
        ))}
      </div>
      <Button
        variant="main"
        size="lg"
        disabled={isMaxQuantity}
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
}
