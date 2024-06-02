import { cookies } from "next/headers";
import { getCartCookie } from "@/lib/utils/cart";

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
    const cart = getCartCookie();

    const currentProduct = cart[itemSlug];

    let newCurrentProduct = currentProduct
      ? { ...currentProduct, quanity: currentProduct.quanity + 1 }
      : { quanity: 1, color: "todo" };

    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({ ...cart, [itemSlug]: newCurrentProduct }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
