import { common_OrderItemInsert } from "@/api/proto-http/frontend";
import NewOrderForm from "@/components/forms/NewOrderForm";
import { redirect } from "next/navigation";
import CoreLayout from "@/components/layouts/CoreLayout";
import {
  getCartProductSlugAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";

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

  return (
    <CoreLayout>
      <NewOrderForm orderItems={orderItems} />
    </CoreLayout>
  );
}
