import { addCartProduct, clearCartProducts } from "@/actions/cart";
import {
  common_OrderItem,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import { serviceClient } from "@/lib/api";
import { getValidateOrderItemsInsertItems } from "@/lib/utils/cart";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const items = getValidateOrderItemsInsertItems();

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
