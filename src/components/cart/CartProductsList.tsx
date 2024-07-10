import CartItemRow from "@/components/cart/CartItemRow";
import Button from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import { getProductPrice } from "@/lib/utils";
import { getCartCookie } from "@/lib/utils/cart";
import Link from "next/link";

export default async function CartProductsList() {
  const cart = getCartCookie();

  if (!cart || !cart.products) return null;

  const cartItems = Object.values(cart.products) as {
    quantity: number;
    slug: string;
    size?: string;
  }[];

  const productsPromises = cartItems.map(async (item) => {
    const [gender, brand, name, id] = item.slug.split("/");
    const response = await serviceClient.GetProduct({
      gender,
      brand,
      name,
      id: parseInt(id),
    });
    const product = response.product;

    return {
      quantity: item.quantity,
      slug: item.slug,
      size: item.size,
      product: product,
    };
  });

  const products = await Promise.all(productsPromises);

  // TOTAL PRICE
  let totalPrice = 0;
  products.forEach((x) => (totalPrice += getProductPrice(x.product)));

  return products.map((p) => (
    <Button key={p?.product?.product?.id as number} asChild>
      <Link href={p?.product?.product?.slug || ""}>
        <CartItemRow
          product={p?.product}
          quantity={p?.quantity}
          size={p?.size}
        />
      </Link>
    </Button>
  ));
}
