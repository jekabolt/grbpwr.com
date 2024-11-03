import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { serviceClient } from "@/lib/api";

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
        increaseQuantity: async (
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

          try {
            const response = await serviceClient.ValidateOrderItemsInsert({
              items: updatedProducts.map((p) => ({
                productId: p.id,
                quantity: p.quantity,
                sizeId: Number(p.size),
              })),
              shipmentCarrierId: undefined,
              promoCode: undefined,
            });

            const validatedProducts = updatedProducts.map((product) => {
              const validatedItem = response.validItems?.find(
                (item) =>
                  item.orderItem?.productId === product.id &&
                  item.orderItem?.sizeId === Number(product.size),
              );

              const newQuantity =
                validatedItem?.orderItem?.quantity || product.quantity;

              delete validatedItem?.orderItem;

              return {
                ...product,
                quantity: newQuantity,
                productData: validatedItem,
              };
            });

            set({
              products: validatedProducts,
              totalItems: validatedProducts.reduce(
                (sum, p) => sum + p.quantity,
                0,
              ),
            });
          } catch (error) {
            console.error("increaseQuantity failed 💩:", error);
          }
        },

        decreaseQuantity: async (productId: number, size: string) => {
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

          try {
            const response = await serviceClient.ValidateOrderItemsInsert({
              items: updatedProducts.map((p) => ({
                productId: p.id,
                quantity: p.quantity,
                sizeId: Number(p.size),
              })),
              shipmentCarrierId: undefined,
              promoCode: undefined,
            });

            const validatedProducts = updatedProducts.map((product) => {
              const validatedItem = response.validItems?.find(
                (item) =>
                  item.orderItem?.productId === product.id &&
                  item.orderItem?.sizeId === Number(product.size),
              );

              const newQuantity =
                validatedItem?.orderItem?.quantity || product.quantity;

              delete validatedItem?.orderItem;

              return {
                ...product,
                quantity: newQuantity,
                productData: validatedItem,
              };
            });

            set({
              products: validatedProducts,
              totalItems: validatedProducts.reduce(
                (sum, p) => sum + p.quantity,
                0,
              ),
            });
          } catch (error) {
            console.error("decreaseQuantity failed 💩:", error);
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
