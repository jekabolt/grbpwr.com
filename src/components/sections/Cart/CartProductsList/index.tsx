import { addCartProduct, clearCartProducts } from "@/actions/cart";
import { Button } from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import { getValidateOrderItemsInsertItems } from "@/lib/utils/cart";
import Link from "next/link";
import CartItemRow from "../CartItemRow";
import SelectedCurrency from "../TotalPrice/SelectedCurrency";
import HACK__UpdateCookieCart from "./HACK__UpdateCookieCart";
import { cn } from "@/lib/utils";

export default async function CartProductsList({
  className,
}: {
  className?: string;
}) {
  const items = getValidateOrderItemsInsertItems();

  if (items.length === 0) return null;

  const response = await serviceClient.ValidateOrderItemsInsert({
    items,
    shipmentCarrierId: undefined,
    promoCode: undefined,
  });

  const updateCookieCart = async () => {
    "use server";

    if (response?.validItems && response?.validItems?.length > 0) {
      clearCartProducts();

      for (const p of response.validItems) {
        if (
          p.orderItem?.productId &&
          p.orderItem.quantity &&
          p.orderItem.sizeId
        ) {
          addCartProduct({
            id: p.orderItem.productId,
            size: p.orderItem.sizeId.toString(),
            quantity: p.orderItem.quantity,
          });
        }
      }
    }
  };

  return (
    <div className={"space-y-6"}>
      {response?.validItems?.map((p, i) => (
        <CartItemRow
          key={(p.id as number) + i}
          product={p}
          className={className}
        />
      ))}
      <SelectedCurrency baseCurrencyTotal={Number(response.totalSale?.value)} />
      {response.hasChanged && (
        <HACK__UpdateCookieCart updateCookieCart={updateCookieCart} />
      )}
    </div>
  );
}
