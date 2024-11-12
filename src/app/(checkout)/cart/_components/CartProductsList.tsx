"use client";

import { useCart } from "@/lib/stores/cart/store-provider";
import CartItemRow from "@/app/(checkout)/cart/_components/CartItemRow";

import TotalPrice from "./TotalPrice";

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

  console.log(products);

  return (
    <div className={"space-y-6"}>
      {products?.map((p, i) => (
        <CartItemRow
          key={p?.productData?.id + "" + p?.productData?.orderId + i}
          product={p.productData}
          className={className}
          hideQuantityButtons={hideQuantityButtons}
        />
      ))}
      <TotalPrice />
    </div>
  );
}
