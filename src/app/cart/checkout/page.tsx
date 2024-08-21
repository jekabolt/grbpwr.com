import { clearCartProducts } from "@/actions/cart";
import {
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import CoreLayout from "@/components/layouts/CoreLayout";
import { serviceClient } from "@/lib/api";
import {
  getCartProductIdAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import { redirect } from "next/navigation";

export default async function Page() {
  async function validateOrderItems(
    promoCode: string | undefined,
    shipmentCarrierId: number | undefined,
  ) {
    "use server";
    const cartData = getCookieCart();

    if (!cartData || !cartData.products) return redirect("/cart");

    try {
      const order = await (async () =>
        serviceClient.ValidateOrderItemsInsert({
          items: Object.entries(cartData.products).map(([key, quantity]) => {
            const productIdAndSize = getCartProductIdAndSizeFromKey(key);
            return {
              productId: Number(productIdAndSize?.id),
              sizeId: Number(productIdAndSize?.size),
              quantity,
            } as common_OrderItemInsert;
          }),
          shipmentCarrierId: shipmentCarrierId,
          promoCode: promoCode,
        }))();

      if (order.hasChanged) {
        // show toast - order items changed and init new cookies
      }
      return order;
    } catch (e) {
      // error validating order items
      console.log(e);
    }
  }

  async function submitNewOrder(newOrderData: common_OrderNew) {
    "use server";

    try {
      const submitOrderResponse = await serviceClient.SubmitOrder({
        order: newOrderData,
      });

      const { order } = submitOrderResponse;

      if (!order?.uuid) {
        console.log("no data to create order invoice");

        return {
          ok: false,
        };
      }

      const getOrderInvoiceResponse = await serviceClient.GetOrderInvoice({
        orderUuid: order.uuid,
        paymentMethod: "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA",
      });

      console.log({
        ok: true,
        order,
        getOrderInvoiceResponse,
      });

      clearCartProducts();

      return {
        ok: true,
        order,
        getOrderInvoiceResponse,
      };
    } catch (error) {
      console.error("Error submitting new order:", error);
      return {
        ok: false,
      };
    }
  }

  const order = await validateOrderItems(undefined, undefined);

  return (
    <CoreLayout>
      <NewOrderForm
        submitNewOrder={submitNewOrder}
        validateOrderItems={validateOrderItems}
        order={order}
      />
    </CoreLayout>
  );
}
