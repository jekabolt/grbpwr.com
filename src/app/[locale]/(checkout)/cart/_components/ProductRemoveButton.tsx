"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useCartAnalytics } from "@/lib/analitycs/useCartAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";

type Props = {
  id: number;
  size: string;
  index?: number;
  product: common_OrderItem;
};

export default function ProductRemoveButton({
  id,
  size,
  index = 0,
  product,
}: Props) {
  const t = useTranslations("cart");
  const { removeProduct, productToRemove, setProductToRemove } = useCart(
    (state) => state,
  );
  const { handleRemoveFromCartEvent } = useCartAnalytics({
    finalProducts: [product],
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isRemoveConfirmed =
    productToRemove &&
    productToRemove.id === id &&
    productToRemove.size === size &&
    productToRemove.index === index;

  useEffect(() => {
    if (!isRemoveConfirmed) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setProductToRemove(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRemoveConfirmed, setProductToRemove]);

  const handleRemove = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isRemoveConfirmed) {
      removeProduct(id, size, index);
      handleRemoveFromCartEvent(product);
      setProductToRemove(null);
    } else {
      setProductToRemove({ id, size, index });
    }
  };

  return (
    <div ref={wrapperRef} className="flex justify-end">
      <Button
        type="button"
        onPointerDown={handleRemove}
        variant="underline"
        className="min-h-0 min-w-[4.5rem] touch-manipulation self-start p-0 text-right uppercase"
      >
        {isRemoveConfirmed ? t("sure?") : t("remove")}
      </Button>
    </div>
  );
}
