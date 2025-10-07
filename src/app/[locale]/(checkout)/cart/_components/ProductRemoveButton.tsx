"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { sendRemoveFromCartEvent } from "@/lib/analitycs/cart";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";

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
  const { selectedCurrency } = useCurrency((state) => state);
  const { removeProduct, productToRemove, setProductToRemove } = useCart(
    (state) => state,
  );

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
      sendRemoveFromCartEvent(selectedCurrency, product);
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
        {isRemoveConfirmed ? t("sure?") : t("remove")}
      </Button>
    </>
  );
}
