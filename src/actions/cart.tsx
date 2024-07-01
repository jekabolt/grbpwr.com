import { serviceClient } from "@/lib/api";
import { getProductPrice } from "@/lib/utils";
import { createCartId, getCartCookie } from "@/lib/utils/cart";
import { cookies } from "next/headers";

export const GRBPWR_CART = "grbpwr-cart";

export async function addItemToCookie(slug: string, size?: string) {
  "use server";

  const product = await serviceClient
    .GetProduct({
      slug: slug,
    })
    .then((x) => x.product);

  const cartId = createCartId(slug, size);
  const productPrice = getProductPrice(product);

  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) {
    cookieStore.set(
      GRBPWR_CART,
      // TODO: PASS COLOR FIELD
      JSON.stringify({
        products: {
          [cartId]: { quantity: 1, product: product, size: size },
        },
        totalPrice: productPrice,
      }),
    );

    return;
  }

  try {
    const cart = getCartCookie();

    const currentProduct = cart.products[cartId];

    let newCurrentProduct = currentProduct
      ? { ...currentProduct, quantity: currentProduct.quantity + 1, size: size }
      : { quantity: 1, product: product, size: size };

    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({
        products: { ...cart.products, [cartId]: newCurrentProduct },
        totalPrice: cart.totalPrice + productPrice,
      }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

// todo: check
export async function removeItemFromCookie(slug: string, size?: string) {
  "use server";
  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) return;

  const cartId = createCartId(slug, size);

  try {
    const cart = getCartCookie();
    const productPrice = getProductPrice(cart.products[cartId].product);
    const newTotalPrice =
      cart.totalPrice - productPrice * cart.products[cartId].quantity;
    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({
        products: { ...cart.products, [cartId]: undefined },
        totalPrice: newTotalPrice,
      }),
    );
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function decreaseItemCountFromCookie(slug: string, size?: string) {
  "use server";
  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) return;

  const cartId = createCartId(slug, size);

  try {
    const cart = getCartCookie();
    const productPrice = getProductPrice(cart.products[cartId].product);
    if (cart.products[cartId].quantity > 1) {
      cookieStore.set(
        GRBPWR_CART,
        JSON.stringify({
          products: {
            ...cart.products,
            [cartId]: {
              ...cart.products[cartId],
              quantity: cart.products[cartId].quantity - 1,
            },
          },
          totalPrice: cart.totalPrice - productPrice,
        }),
      );
    } else {
      removeItemFromCookie(cartId);
    }
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
