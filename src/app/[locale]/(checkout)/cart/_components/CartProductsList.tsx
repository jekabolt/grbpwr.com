"use client";

import { useEffect } from "react";
import { common_OrderItem } from "@/api/proto-http/frontend";

import { sendViewCartEvent } from "@/lib/analitycs/cart";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import ItemRow from "@/app/[locale]/(checkout)/cart/_components/ItemRow";

export default function CartProductsList({
  hideQuantityButtons,
  validatedProducts,
}: Props) {
  const products = useCart((state) => state.products).map((v) => v.productData);
  const finalProducts = validatedProducts || products;
  const { selectedCurrency } = useCurrency((state) => state);

  useEffect(() => {
    if (finalProducts && selectedCurrency) {
      sendViewCartEvent(selectedCurrency, finalProducts as common_OrderItem[]);
    }
  }, [finalProducts, selectedCurrency]);

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
