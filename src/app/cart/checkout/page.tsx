import { addCartProduct, clearCartProducts } from "@/actions/cart";
import {
  common_OrderItem,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import CoreLayout from "@/components/layouts/CoreLayout";
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

  async function submitNewOrder(newOrderData: common_OrderNew) {
    "use server";

    try {
      const submitOrderResponse = await serviceClient.SubmitOrder({
        order: newOrderData,
      });

      if (!submitOrderResponse?.orderUuid) {
        console.log("no data to create order invoice");

        return {
          ok: false,
        };
      }

      console.log({
        ok: true,
        order: submitOrderResponse,
      });

      clearCartProducts();

      return {
        ok: true,
        order: submitOrderResponse,
      };
    } catch (error) {
      console.error("Error submitting new order:", error);
      return {
        ok: false,
      };
    }
  }

  const updateCookieCart = async (validItems: common_OrderItem[]) => {
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
  };

  return (
    <CoreLayout hidePopupCart>
      <NewOrderForm
        submitNewOrder={submitNewOrder}
        order={response}
        updateCookieCart={updateCookieCart}
      />
    </CoreLayout>
  );
}
