import { serviceClient } from "@/lib/api";
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

  const cookieStore = cookies();

  if (!cookieStore.has(GRBPWR_CART)) {
    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({
        products: {
          [cartId]: { slug: slug, size: size, quantity: 1 },
        },
      }),
    );

    return;
  }

  try {
    const cart = getCartCookie();

    const currentProduct = cart.products[cartId];

    let newCurrentProduct = currentProduct
      ? { ...currentProduct, quantity: currentProduct.quantity + 1, size: size }
      : { quantity: 1, slug: slug, size: size };

    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({
        products: { ...cart.products, [cartId]: newCurrentProduct },
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
    cookieStore.set(
      GRBPWR_CART,
      JSON.stringify({
        products: { ...cart.products, [cartId]: undefined },
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
        }),
      );
    } else {
      removeItemFromCookie(cartId);
    }
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}
