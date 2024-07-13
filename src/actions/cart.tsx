import {
  createCookieCartProduct,
  getCookieCart,
  updateCookieCartProduct,
  removeCookieCartProduct,
  changeCookieCartProductQuanity,
  getCartProductKey,
} from "@/lib/utils/cart";

export const GRBPWR_CART = "grbpwr-cart";

export async function addCartProduct(slug: string, size: string) {
  "use server";

  const cartData = getCookieCart();

  try {
    if (!cartData) {
      createCookieCartProduct(slug, size);

      return;
    }

    const productKey = getCartProductKey(slug, size);
    const cartProduct = cartData.products[productKey];
    let newProductQuanity;

    if (cartProduct) {
      newProductQuanity = cartProduct.quanity + 1;
    } else {
      newProductQuanity = 1;
    }

    updateCookieCartProduct(slug, size, newProductQuanity);
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function removeCartProduct(slug: string, size: string) {
  "use server";

  try {
    removeCookieCartProduct(slug, size);
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function changeCartProductQuanity({
  slug,
  size,
  operation,
}: {
  slug: string;
  size: string;
  operation: "increase" | "decrease";
}) {
  "use server";

  try {
    const cartData = getCookieCart();
    if (
      operation === "decrease" &&
      cartData?.products[getCartProductKey(slug, size)]?.quanity === 1
    ) {
      removeCookieCartProduct(slug, size);

      return;
    }

    changeCookieCartProductQuanity(slug, size, operation);
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
