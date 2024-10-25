import { redirect } from "next/navigation";
import {
  common_OrderItem,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";

import { addCartProduct, clearCartProducts } from "@/lib/actions/cart";
import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NavigationLayout from "@/app/_components/navigation-layout";
import { getValidateOrderItemsInsertItems } from "@/app/(checkout)/cart/_components/utils";

import NewOrderForm from "./_components/new-order-form";

export default async function CheckoutPage() {
  const items = await getValidateOrderItemsInsertItems();

  if (items.length === 0) return null;

  const response = await serviceClient.ValidateOrderItemsInsert({
    items,
    shipmentCarrierId: undefined,
    promoCode: undefined,
  });

  async function updateCookieCart(validItems: common_OrderItem[]) {
    "use server";

    clearCartProducts();

    for (const p of validItems) {
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

  return (
    <NavigationLayout>
      <NewOrderForm order={response} updateCookieCart={updateCookieCart} />
    </NavigationLayout>
  );
}
