import {
  createCookieCartProduct,
  getCartProductKey,
  getCookieCart,
  removeCookieCartProduct,
  updateCookieCartProduct,
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
      quantity: 0,
      price: 0,
    };

    if (cartProduct) {
      newProduct.quantity = cartProduct.quantity + 1;
      newProduct.price = cartProduct.price + price;
    } else {
      newProduct.quantity = 1;
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

export async function changeCartProductquantity({
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

    if (operation === "decrease" && cartProduct.quantity === 1) {
      removeCookieCartProduct(slug, size);

      return;
    }

    const newProduct = {
      quantity: cartProduct.quantity,
      price: cartProduct.price,
    };

    if (operation === "decrease") {
      newProduct.quantity = cartProduct.quantity - 1;
      newProduct.price = cartProduct.price - price;
    }

    if (operation === "increase") {
      newProduct.quantity = cartProduct.quantity + 1;
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
