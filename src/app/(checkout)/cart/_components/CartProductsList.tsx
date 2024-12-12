"use client";

import { common_OrderItem } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Skeleton } from "@/components/ui/skeleton";
import ItemRow from "@/app/(checkout)/cart/_components/ItemRow";

// wrapped in suspense. new technics should be used
// think how make it easy
export default function CartProductsList({
  hideQuantityButtons,
  validatedProducts,
}: Props) {
  const products = useCart((state) => state.products).map((v) => v.productData);
  const finalProducts = validatedProducts || products;

  if (!finalProducts || finalProducts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl">add shell</h1>
        <Skeleton className="h-16" />
      </div>
    );
  }

  return (
    <>
      {finalProducts.map((p, i) => (
        <ItemRow
          key={p?.id + "" + p?.orderId + i}
          product={p}
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
