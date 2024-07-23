import { common_OrderItemInsert } from "@/api/proto-http/frontend";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CoreLayout from "@/components/layouts/CoreLayout";
import {
  getCartProductSlugAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";

export default async function Page() {
  const orderItems = createOrderArray();

  function createOrderArray(): common_OrderItemInsert[] {
    const cartItems = getCookieCart();
    if (!cartItems || !cartItems.products) return [];

    const orderArray: common_OrderItemInsert[] = [];

    for (const key in cartItems.products) {
      const productData = cartItems.products[key];
      const slugAndSize = getCartProductSlugAndSizeFromKey(key);

      if (!slugAndSize) continue;

      const { slug, size } = slugAndSize;
      const productId = getProductIdFromSlug(slug);

      //TO-DO map size id from dictionary
      // const sizeId = getSizeIdBySize(size);

      const sizeId = 1;

      const orderItem: common_OrderItemInsert = {
        productId,
        quantity: productData.quantity,
        sizeId,
      };

      orderArray.push(orderItem);
    }

    return orderArray;
  }

  function getProductIdFromSlug(slug: string): number | undefined {
    const [gender, brand, name, id] = slug
      ?.replaceAll("/product/", "")
      .split("/");

    return id ? parseInt(id) : undefined;
  }

  return (
    <CoreLayout>
      <CheckoutForm orderItems={orderItems} />
    </CoreLayout>
  );
}
