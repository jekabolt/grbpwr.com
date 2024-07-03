import { GRBPWR_CART } from "@/actions/cart";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export function getCartCookie() {
  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) return null;

  try {
    const cart = (cookieStore.get(GRBPWR_CART) as RequestCookie)
      .value as string;
    const cartJson = JSON.parse(cart);

    return cartJson;
  } catch (error) {
    console.log("failed to parse cart", error);
  }

  return null;
}

export function createCartId(slug: string, size?: string): string {
  if (!size) {
    return slug;
  }
  return `${slug}_${size}`;
}
