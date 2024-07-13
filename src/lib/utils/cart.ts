import { GRBPWR_CART } from "@/actions/cart";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

type CookieCartProductData = { quanity: number };
type CookieCartProduct = Record<string, CookieCartProductData>;

export function getCartProductKey(slug: string, size: string) {
  return `${slug}-${size}`;
}

export function getCartProductSlugAndSizeFromKey(key: string) {
  const [slug, size] = key.split("-");

  if (!slug || !size) return null;

  return { slug, size };
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

export function createCookieCartProduct(productSlug: string, size: string) {
  const cookieStore = cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      products: {
        [getCartProductKey(productSlug, size)]: {
          quanity: 1,
        },
      },
    }),
  );
}

export function updateCookieCartProduct(
  productSlug: string,
  size: string,
  quanity: number,
) {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  const productKey = getCartProductKey(productSlug, size);

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      ...cartData,
      products: {
        ...cartData?.products,
        [productKey]: {
          ...cartData?.products[productKey],
          quanity,
        },
      },
    }),
  );
}

export function removeCookieCartProduct(productSlug: string, size: string) {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      ...cartData,
      products: {
        ...cartData?.products,
        [getCartProductKey(productSlug, size)]: undefined,
      },
    }),
  );
}

export function changeCookieCartProductQuanity(
  productSlug: string,
  size: string,
  operation: "increase" | "decrease",
) {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  let operationValue = 0;
  if (operation === "increase") {
    operationValue = 1;
  }
  if (operation === "decrease") {
    operationValue = -1;
  }

  const productKey = getCartProductKey(productSlug, size);
  const initialQuanity = cartData?.products[productKey].quanity || 0;

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      ...cartData,
      products: {
        ...cartData?.products,
        [productKey]: {
          ...cartData?.products[productKey],
          quanity: initialQuanity + operationValue,
        },
      },
    }),
  );
}
