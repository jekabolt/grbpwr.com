"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";

type Props = {
  variantSku: string;
  index?: number;
};

export default function ProductRemoveButton({
  variantSku,
  index = 0,
}: Props) {
  const t = useTranslations("cart");
  const { removeProduct, productToRemove, setProductToRemove } = useCart(
    (state) => state,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isRemoveConfirmed =
    productToRemove &&
    productToRemove.variantSku === variantSku &&
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

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isRemoveConfirmed) {
      removeProduct(variantSku, index);
      setProductToRemove(null);
    } else {
      setProductToRemove({ variantSku, index });
    }
  };

  return (
    <div ref={wrapperRef} className="flex justify-end">
      <Button
        type="button"
        onClick={handleRemove}
        aria-live="polite"
        variant="underline"
        className="min-h-11 min-w-[4.5rem] touch-manipulation self-start p-0 text-right uppercase"
      >
        {isRemoveConfirmed ? t("sure?") : t("remove")}
      </Button>
    </div>
  );
}
