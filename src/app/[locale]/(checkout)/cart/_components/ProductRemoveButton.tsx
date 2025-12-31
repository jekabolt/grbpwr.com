"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { useCartAnalytics } from "@/lib/analitycs/useCartAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";

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

  const isRemoveConfirmed =
    productToRemove &&
    productToRemove.id === id &&
    productToRemove.size === size &&
    productToRemove.index === index;

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
    <>
      {isRemoveConfirmed && <Overlay color="highlight" cover="container" />}
      <Button
        type="button"
        onClick={handleRemove}
        variant="underline"
        className={cn("uppercase", { "z-20": isRemoveConfirmed })}
      >
        {isRemoveConfirmed ? t("sure?") : t("remove")}
      </Button>
    </>
  );
}
