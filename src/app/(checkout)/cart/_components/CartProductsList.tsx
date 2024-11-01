"use client";

import { useEffect, useState } from "react";
import { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";
import CartItemRow from "@/app/(checkout)/cart/_components/CartItemRow";

import TotalPrice from "./TotalPrice";

// wrapped in suspense. new technics should be used
// think how make it easy
export default function CartProductsList({
  className,
}: {
  className?: string;
}) {
  const [cartItemFullResponse, setCartItemFullResponse] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const products = useCart((state) => state.products);
  console.log(products);

  useEffect(() => {
    async function fetchData() {
      const response = await serviceClient.ValidateOrderItemsInsert({
        items: products.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          sizeId: Number(p.size),
        })),
        shipmentCarrierId: undefined,
        promoCode: undefined,
      });

      setCartItemFullResponse(response);
    }

    fetchData();
  }, [products]);

  return (
    <div className={"space-y-6"}>
      {cartItemFullResponse?.validItems?.map((p) => (
        <CartItemRow key={p.slug} product={p} className={className} />
      ))}
      <TotalPrice />
    </div>
  );
}
