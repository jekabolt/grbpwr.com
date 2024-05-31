"server-only";

import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const GRBPWR_CART = "grbpwr-cart";

export async function addItemToCookie(itemSlug: string) {
  "use server";

  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) {
    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({ [itemSlug]: { quanity: 1, color: "todo" } }),
    );

    return;
  }

  try {
    const cart = (cookieStore.get(GRBPWR_CART) as RequestCookie)
      .value as string;
    const cartJson = JSON.parse(cart);

    const currentProduct = cartJson[itemSlug];

    let newCurrentProduct = currentProduct
      ? { ...currentProduct, quanity: currentProduct.quanity + 1 }
      : { quanity: 1, color: "todo" };

    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({ ...cartJson, [itemSlug]: newCurrentProduct }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
