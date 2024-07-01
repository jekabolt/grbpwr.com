import { common_ProductFull } from "@/api/proto-http/frontend";
import CartItemRow from "@/components/cart/CartItemRow";
import Button from "@/components/ui/Button";
import { getCartCookie } from "@/lib/utils/cart";
import Link from "next/link";

export default function CartProductsList() {
  const cart = getCartCookie();

  if (!cart || !cart.products) return null;

  const cartItems = Object.values(cart.products) as {
    quantity: number;
    product: common_ProductFull | undefined;
    size?: string;
  }[];

  return cartItems.map((p) => (
    <Button key={p?.product?.product?.id as number} asChild>
      <Link href={`/catalog/${p?.product?.product?.slug}`}>
        <CartItemRow
          product={p?.product}
          quantity={p?.quantity}
          size={p?.size}
        />
      </Link>
    </Button>
  ));
}
