import { common_OrderItemInsert } from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import CoreLayout from "@/components/layouts/CoreLayout";
import {
  getCartProductSlugAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import { redirect } from "next/navigation";

export default async function Page() {
  const cartData = getCookieCart();
  const cartProducts = cartData?.products;

  if (!cartProducts || !Object.keys(cartProducts)) return redirect("/cart");

  const order = Object.entries(cartProducts).reduce(
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

      acc.items.push(item);
      acc.totalPrice += value.price * value.quantity;

      return acc;
    },
    { items: [] as common_OrderItemInsert[], totalPrice: 0 },
  );

  return (
    <CoreLayout>
      <NewOrderForm orderItems={order.items} totalPrice={order.totalPrice} />
    </CoreLayout>
  );
}
