import Button from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import {
  getCartProductSlugAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import Link from "next/link";
import CartItemRow from "./CartItemRow";

export default async function CartProductsList() {
  const cartData = getCookieCart();

  console.log("cartData");
  console.log(cartData);

  if (!cartData || !cartData.products) return null;

  const productsPromises = Object.entries(cartData.products).map(
    async ([productCartKey, { quantity }]) => {
      const productSlugAndSize =
        getCartProductSlugAndSizeFromKey(productCartKey);

      if (productSlugAndSize) {
        const { slug, size } = productSlugAndSize;
        const item = {
          slug,
          size,
          quantity,
        };

        const [gender, brand, name, id] = slug
          ?.replaceAll("/product/", "")
          .split("/");

        try {
          const response = await serviceClient.GetProduct({
            gender,
            brand,
            name,
            id: parseInt(id),
          });

          const product = response.product;

          return {
            ...item,
            product: product,
          };
        } catch (error) {
          console.log("failed to fetch cart product", error);
        }
      }
    },
  );

  const products = (await Promise.all(productsPromises)).filter(Boolean);

  return products.map((p) => (
    <Button key={p?.product?.product?.id as number} asChild>
      <Link href={p?.product?.product?.slug || ""}>
        <CartItemRow
          product={p?.product}
          quantity={p?.quantity || 0}
          size={p?.size || ""}
        />
      </Link>
    </Button>
  ));
}
