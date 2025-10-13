"use client";

import { useEffect } from "react";
import { common_OrderItem } from "@/api/proto-http/frontend";

import { sendViewCartEvent } from "@/lib/analitycs/cart";
import { useCart } from "@/lib/stores/cart/store-provider";
import ItemRow from "@/app/[locale]/(checkout)/cart/_components/ItemRow";

export default function CartProductsList({
  hideQuantityButtons,
  validatedProducts,
}: Props) {
  const { isOpen } = useCart((state) => state);
  const products = useCart((state) => state.products).map((v) => v.productData);
  const finalProducts = validatedProducts || products;

  useEffect(() => {
    if (finalProducts && isOpen) {
      sendViewCartEvent(finalProducts as common_OrderItem[]);
    }
  }, [finalProducts, isOpen]);

  return (
    <>
      {finalProducts.map((p, i) => (
        <ItemRow
          key={p?.id + "" + p?.orderId + i}
          product={p}
          index={i}
          hideQuantityButtons={hideQuantityButtons}
        />
      ))}
    </>
  );
}

type Props = {
  hideQuantityButtons?: boolean;
  validatedProducts?: common_OrderItem[];
};
