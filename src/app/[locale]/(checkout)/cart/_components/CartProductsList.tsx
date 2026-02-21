"use client";

import { useEffect } from "react";
import { common_OrderItem } from "@/api/proto-http/frontend";

import { useCartAnalytics } from "@/lib/analitycs/useCartAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";
import ItemRow from "@/app/[locale]/(checkout)/cart/_components/ItemRow";

export default function CartProductsList({
  hideQuantityButtons,
  validatedProducts,
  currencyKey,
}: Props) {
  const { isOpen } = useCart((state) => state);
  const products = useCart((state) => state.products).map((v) => v.productData);
  const finalProducts = validatedProducts || products;
  const { handleViewCartEvent } = useCartAnalytics({ finalProducts });

  useEffect(() => {
    if (isOpen && finalProducts.length > 0) {
      handleViewCartEvent();
    }
  }, [isOpen, finalProducts.length]);

  return (
    <>
      {finalProducts.map((p, i) => (
        <ItemRow
          key={p?.id + "" + p?.orderId + i}
          product={p}
          index={i}
          hideQuantityButtons={hideQuantityButtons}
          currencyKey={currencyKey}
        />
      ))}
    </>
  );
}

type Props = {
  hideQuantityButtons?: boolean;
  validatedProducts?: common_OrderItem[];
  /** When provided (e.g. order confirmation), use this currency instead of user's current locale */
  currencyKey?: string;
};
