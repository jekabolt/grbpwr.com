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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isRemoveConfirmed =
    productToRemove &&
    productToRemove.id === id &&
    productToRemove.size === size &&
    productToRemove.index === index;

  useEffect(() => {
    if (!isRemoveConfirmed) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setProductToRemove(null);
      }
    };

    // pointerdown fires for both touch and mouse - more reliable on mobile
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRemoveConfirmed, setProductToRemove]);

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
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
    <Button
      ref={buttonRef}
      type="button"
      onClick={handleRemove}
      variant="underline"
      className="min-h-[44px] min-w-[4.5rem] touch-manipulation uppercase"
    >
      {isRemoveConfirmed ? t("sure?") : t("remove")}
    </Button>
  );
}
