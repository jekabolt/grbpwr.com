import { createStore } from "zustand/vanilla";

import { CartProduct, CartState, CartStore } from "./store-types";

export const defaultInitState: CartState = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()((set, get) => ({
    ...initState,

    addProduct: (product: CartProduct) => {
      const { products } = get();
      const existingProduct = products.find(
        (p) => p.id === product.id && p.size === product.size,
      );

      if (existingProduct) {
        const updatedProducts = products.map((p) =>
          p.id === product.id && p.size === product.size
            ? { ...p, quantity: p.quantity + product.quantity }
            : p,
        );
        set({
          products: updatedProducts,
          totalItems: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
        });
      } else {
        const updatedProducts = [...products, product];
        set({
          products: updatedProducts,
          totalItems: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
        });
      }
    },

    removeProduct: (productId: number, size: string) => {
      const { products } = get();
      const updatedProducts = products.filter(
        (p) => !(p.id === productId && p.size === size),
      );
      set({
        products: updatedProducts,
        totalItems: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
      });
    },

    increaseQuantity: (productId: number, size: string) => {
      const { products } = get();
      const updatedProducts = products.map((p) =>
        p.id === productId && p.size === size
          ? { ...p, quantity: p.quantity + 1 }
          : p,
      );
      set({
        products: updatedProducts,
        totalItems: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
      });
    },

    decreaseQuantity: (productId: number, size: string) => {
      const { products } = get();
      const updatedProducts = products
        .map((p) =>
          p.id === productId && p.size === size && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p,
        )
        .filter((p) => p.quantity > 0);
      set({
        products: updatedProducts,
        totalItems: updatedProducts.reduce((sum, p) => sum + p.quantity, 0),
      });
    },

    clearCart: () => {
      set(defaultInitState);
    },
  }));
};
