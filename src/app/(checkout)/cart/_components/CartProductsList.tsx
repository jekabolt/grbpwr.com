"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import ItemRow from "@/app/(checkout)/cart/_components/ItemRow";

export default function CartProductsList({
  hideQuantityButtons,
  validatedProducts,
}: Props) {
  const products = useCart((state) => state.products).map((v) => v.productData);
  const finalProducts = validatedProducts || products;

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
