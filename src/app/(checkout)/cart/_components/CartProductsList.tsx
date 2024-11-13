"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import ItemRow from "@/app/(checkout)/cart/_components/ItemRow";

import CartTotalPrice from "./CartTotalPrice";

// wrapped in suspense. new technics should be used
// think how make it easy
export default function CartProductsList({
  className,
  hideQuantityButtons,
}: {
  className?: string;
  hideQuantityButtons?: boolean;
}) {
  const products = useCart((state) => state.products);

  return (
    <div className={"space-y-6"}>
      {products?.map((p, i) => (
        <ItemRow
          key={p?.productData?.id + "" + p?.productData?.orderId + i}
          product={p.productData}
          className={className}
          hideQuantityButtons={hideQuantityButtons}
        />
      ))}
      <CartTotalPrice />
    </div>
  );
}
