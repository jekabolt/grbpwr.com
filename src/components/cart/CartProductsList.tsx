import CartItemRow from "@/components/cart/CartItemRow";
import Button from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import { getCartCookie } from "@/lib/utils/cart";
import Link from "next/link";

export default async function CartProductsList() {
  const cart = getCartCookie();

  if (!cart) return null;

  const cartProductSlugs = Object.keys(cart);

  const productsPromises = cartProductSlugs.map((s) =>
    serviceClient.GetProduct({
      slug: s,
    }),
  );

  const products = await Promise.all(productsPromises).then((v) =>
    v.map((p) => p.product),
  );

  return products.map((p) => (
    <Button key={p?.product?.id as number} asChild>
      <Link href={`/catalog/${p?.product?.slug}`}>
        <CartItemRow product={p} />
      </Link>
    </Button>
  ));
}
