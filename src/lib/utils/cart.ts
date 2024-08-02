import { GRBPWR_CART } from "@/actions/cart";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

type CookieCartProductData = { quantity: number; price: number };
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

export function createCookieCartProduct({
  productSlug,
  size,
  price,
}: {
  productSlug: string;
  size: string;
  price: number;
}) {
  const cookieStore = cookies();

  cookieStore.set(
    GRBPWR_CART,
    JSON.stringify({
      products: {
        [getCartProductKey(productSlug, size)]: {
          quantity: 1,
          price,
        },
      },
    }),
  );
}

export function updateCookieCartProduct({
  productSlug,
  size,
  data,
}: {
  productSlug: string;
  size: string;
  data: CookieCartProductData;
}) {
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
          ...data,
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

export function clearCookieCartProducts() {
  const cartData = getCookieCart();
  const cookieStore = cookies();

  cookieStore.set(GRBPWR_CART, JSON.stringify({ ...cartData, products: {} }));
}
