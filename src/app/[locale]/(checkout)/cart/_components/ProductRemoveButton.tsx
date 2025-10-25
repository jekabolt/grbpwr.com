"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { sendRemoveFromCartEvent } from "@/lib/analitycs/cart";
import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
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
  const { dictionary } = useDataContext();
  const { removeProduct, productToRemove, setProductToRemove } = useCart(
    (state) => state,
  );

  const topCategory = getTopCategoryName(
    dictionary?.categories || [],
    product.topCategoryId || 0,
    1,
  );

  const subCategory = getSubCategoryName(
    dictionary?.categories || [],
    product.subCategoryId || 0,
    1,
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
      sendRemoveFromCartEvent(product, topCategory || "", subCategory || "");
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
