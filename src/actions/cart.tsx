import { cookies } from "next/headers";
import { getCartCookie } from "@/lib/utils/cart";

export const GRBPWR_CART = "grbpwr-cart";

export async function addItemToCookie(itemSlug: string) {
  "use server";

  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) {
    cookieStore.set(
      GRBPWR_CART,
      // TODO: PASS COLOR FIELD
      JSON.stringify({ [itemSlug]: { quanity: 1, color: "todo" } }),
    );

    return;
  }

  // fetch data by slug

  try {
    const cart = getCartCookie();

    const currentProduct = cart[itemSlug];

    let newCurrentProduct = currentProduct
      ? { ...currentProduct, quanity: currentProduct.quanity + 1 }
      : { quanity: 1, color: "" };

    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({ ...cart, [itemSlug]: newCurrentProduct }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

// todo: check
export async function removeItemFromCookie(itemSlug: string) {
  "use server";
  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) return;
  try {
    const cart = getCartCookie();
    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({ ...cart, [itemSlug]: undefined }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
