import {
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import { redirect } from "next/navigation";
import CoreLayout from "@/components/layouts/CoreLayout";
import {
  getCartProductSlugAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import { serviceClient } from "@/lib/api";
import { clearCartProducts } from "@/actions/cart";

export default async function Page() {
  const cartData = getCookieCart();
  const cartProducts = cartData?.products;

  if (!cartProducts || !Object.keys(cartProducts)) return redirect("/cart");

  const orderItems = Object.entries(cartProducts).reduce(
    (acc, [key, value]) => {
      const slugAndSize = getCartProductSlugAndSizeFromKey(key);

      if (!slugAndSize) return acc;

      const [_, __, ___, id] = slugAndSize.slug
        .replaceAll("/product/", "")
        .split("/");

      const item = {
        productId: Number(id),
        quantity: value.quantity,
        sizeId: Number(slugAndSize.size),
      };

      acc.push(item);

      return acc;
    },
    [] as common_OrderItemInsert[],
  );

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

  return (
    <CoreLayout>
      <NewOrderForm submitNewOrder={submitNewOrder} orderItems={orderItems} />
    </CoreLayout>
  );
}
