import {
  createCookieCartProduct,
  getCookieCart,
  updateCookieCartProduct,
  removeCookieCartProduct,
  getCartProductKey,
} from "@/lib/utils/cart";

export const GRBPWR_CART = "grbpwr-cart";

export async function addCartProduct({
  slug,
  size,
  price,
}: {
  slug: string;
  size: string;
  price: number;
}) {
  "use server";

  const cartData = getCookieCart();

  try {
    if (!cartData) {
      createCookieCartProduct({ productSlug: slug, size, price });

      return;
    }

    const productKey = getCartProductKey(slug, size);
    const cartProduct = cartData.products[productKey];
    const newProduct = {
      quanity: 0,
      price: 0,
    };

    if (cartProduct) {
      newProduct.quanity = cartProduct.quanity + 1;
      newProduct.price = cartProduct.price + price;
    } else {
      newProduct.quanity = 1;
      newProduct.price = price;
    }

    updateCookieCartProduct({ productSlug: slug, size, data: newProduct });
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function removeCartProduct({
  productSlug,
  size,
}: {
  productSlug: string;
  size: string;
}) {
  "use server";

  try {
    removeCookieCartProduct(productSlug, size);
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function changeCartProductQuanity({
  slug,
  size,
  operation,
  price,
}: {
  slug: string;
  price: number;
  size: string;
  operation: "increase" | "decrease";
}) {
  "use server";
  const cartData = getCookieCart();

  try {
    if (!cartData) return;

    const productKey = getCartProductKey(slug, size);
    const cartProduct = cartData.products[productKey];

    if (operation === "decrease" && cartProduct.quanity === 1) {
      removeCookieCartProduct(slug, size);

      return;
    }

    const newProduct = {
      quanity: cartProduct.quanity,
      price: cartProduct.price,
    };

    if (operation === "decrease") {
      newProduct.quanity = cartProduct.quanity - 1;
      newProduct.price = cartProduct.price - price;
    }

    if (operation === "increase") {
      newProduct.quanity = cartProduct.quanity + 1;
      newProduct.price = cartProduct.price + price;
    }

    updateCookieCartProduct({
      productSlug: slug,
      size,
      data: newProduct,
    });
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
