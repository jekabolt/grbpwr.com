import { GRBPWR_CART } from "@/actions/cart";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

// type CookieCartProductData = { quantity: number; price: number };
type CookieCartProduct = Record<string, number>;

export function getCartProductKey(id: number, size: string) {
  return `${id}-${size}`;
}

export function getCartProductIdAndSizeFromKey(key: string) {
  const [id, size] = key.split("-");

  if (!id || !size) return null;

  return { id, size };
}

export function getCookieCart(): { products: CookieCartProduct } | null {
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

export function createCookieCartProduct({
  id,
  size,
  quantity = 1,
}: {
  id: number;
  size: string;
  quantity?: number;
}) {
  const cookieStore = cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      products: {
        [getCartProductKey(id, size)]: quantity,
      },
    }),
  );
}

export function updateCookieCartProduct({
  id,
  size,
  quantity,
}: {
  id: number;
  size: string;
  quantity: number;
}) {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  const productKey = getCartProductKey(id, size);

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      ...cartData,
      products: {
        ...cartData?.products,
        [productKey]: quantity,
      },
    }),
  );
}

export function removeCookieCartProduct(id: number, size: string) {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      ...cartData,
      products: {
        ...cartData?.products,
        [getCartProductKey(id, size)]: undefined,
      },
    }),
  );
}

export function clearCookieCartProducts() {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  cookieStore.set(GRBPWR_CART, JSON.stringify({ ...cartData, products: {} }));
}
