import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { GRBPWR_CART } from "@/constants";

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

export async function getCookieCart(): Promise<{
  products: CookieCartProduct;
} | null> {
  const cookieStore = await cookies();

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

export async function createCookieCartProduct({
  id,
  size,
  quantity = 1,
}: {
  id: number;
  size: string;
  quantity?: number;
}) {
  const cookieStore = await cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      products: {
        [getCartProductKey(id, size)]: quantity,
      },
    }),
  );
}

export async function updateCookieCartProduct({
  id,
  size,
  quantity,
}: {
  id: number;
  size: string;
  quantity: number;
}) {
  const cartData = await getCookieCart();
  const cookieStore = await cookies();

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

export async function removeCookieCartProduct(id: number, size: string) {
  const cartData = await getCookieCart();
  const cookieStore = await cookies();

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

export async function clearCookieCartProducts() {
  const cartData = await getCookieCart();
  const cookieStore = await cookies();

  cookieStore.set(GRBPWR_CART, JSON.stringify({ ...cartData, products: {} }));
}

export async function getValidateOrderItemsInsertItems() {
  const cartData = await getCookieCart();

  if (!cartData || !cartData.products) return [];

  return Object.entries(cartData.products).map(([key, quantity]) => {
    const productIdAndSize = getCartProductIdAndSizeFromKey(key);

    return {
      productId: Number(productIdAndSize?.id),
      sizeId: Number(productIdAndSize?.size),
      quantity,
    };
  });
}
