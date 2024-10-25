import {
  clearCookieCartProducts,
  createCookieCartProduct,
  getCartProductKey,
  getCookieCart,
  removeCookieCartProduct,
  updateCookieCartProduct,
} from "../../app/(checkout)/cart/_components/utils";

export async function addCartProduct({
  id,
  size,
  quantity = 1,
}: {
  id: number;
  size: string;
  quantity?: number;
}) {
  "use server";

  const cartData = await getCookieCart();

  try {
    if (!cartData) {
      createCookieCartProduct({ id, size, quantity });

      return;
    }

    const productKey = getCartProductKey(id, size);
    const cartProductQuantity = cartData.products[productKey];
    let newProductQuantity = 0;

    if (cartProductQuantity > 0) {
      newProductQuantity = cartProductQuantity + quantity;
    } else {
      newProductQuantity = quantity;
    }

    updateCookieCartProduct({
      id,
      size,
      quantity: newProductQuantity,
    });
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function removeCartProduct({
  id,
  size,
}: {
  id: number;
  size: string;
}) {
  "use server";

  try {
    removeCookieCartProduct(id, size);
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function changeCartProductQuantity({
  id,
  size,
  operation,
}: {
  id: number;
  size: string;
  operation: "increase" | "decrease";
}) {
  "use server";
  const cartData = await getCookieCart();

  try {
    if (!cartData) return;

    const productKey = getCartProductKey(id, size);
    const cartProductQuantity = cartData.products[productKey];

    if (operation === "decrease" && cartProductQuantity === 1) {
      removeCookieCartProduct(id, size);

      return;
    }

    let newProductQuantity = cartProductQuantity;

    if (operation === "decrease") {
      newProductQuantity = cartProductQuantity - 1;
    }

    if (operation === "increase") {
      newProductQuantity = cartProductQuantity + 1;
    }

    updateCookieCartProduct({
      id,
      size,
      quantity: newProductQuantity,
    });
  } catch (error) {
    console.log("failed to parse cart", error);
  }
}

export async function clearCartProducts() {
  "use server";

  clearCookieCartProducts();
}
