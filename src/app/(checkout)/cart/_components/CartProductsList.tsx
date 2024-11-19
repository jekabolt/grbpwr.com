"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import ItemRow from "@/app/(checkout)/cart/_components/ItemRow";

// wrapped in suspense. new technics should be used
// think how make it easy
export default function CartProductsList({ hideQuantityButtons }: Props) {
  const products = useCart((state) => state.products);

  return (
    <>
      {products?.map((p, i) => (
        <ItemRow
          key={p?.productData?.id + "" + p?.productData?.orderId + i}
          product={p.productData}
          hideQuantityButtons={hideQuantityButtons}
        />
      ))}
    </>
  );
}

type Props = {
  hideQuantityButtons?: boolean;
};
