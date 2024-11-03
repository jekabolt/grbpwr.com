import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { CartProduct, CartState, CartStore } from "./store-types";

export const defaultInitState: CartState = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,
        increaseQuantity: (
          productId: number,
          size: string,
          quantity: number = 1,
        ) => {
          const { products } = get();
          const existingProduct = products.find(
            (p) => p.id === productId && p.size === size,
          );

          let updatedProducts;
          if (existingProduct) {
            updatedProducts = products.map((p) =>
              p.id === productId && p.size === size
                ? { ...p, quantity: p.quantity + quantity }
                : p,
            );
          } else {
            updatedProducts = [...products, { id: productId, size, quantity }];
          }

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
        clearCart: () => {
          set(defaultInitState);
        },
      }),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          products: state.products,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
        }),
      },
    ),
  );
};
