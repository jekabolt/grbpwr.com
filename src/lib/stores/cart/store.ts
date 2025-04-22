import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { serviceClient } from "@/lib/api";

import { CartState, CartStore } from "./store-types";

export const defaultInitState: CartState = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
  subTotalPrice: 0,
  isOpen: false,
  productToRemove: null,
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,

        openCart: () => set({ isOpen: true }),

        closeCart: () => set({ isOpen: false }),

        toggleCart: () => {
          const { isOpen } = get();
          set({ isOpen: !isOpen });
        },

        setProductToRemove: (product) => set({ productToRemove: product }),

        increaseQuantity: async (
          productId: number,
          size: string,
          quantity: number = 1,
        ) => {
          const { products } = get();

          const newItems = Array(quantity)
            .fill(null)
            .map(() => ({ id: productId, size, quantity }));

          const currentQuantity = products.filter(
            p => p.id === productId && p.size === size
          ).length;

          const updatedProducts = [...products, ...newItems];

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

            const validatedItem = response.validItems?.find(
              (item) =>
                item.orderItem?.productId === productId &&
                item.orderItem?.sizeId === Number(size)
            );

            const maxAllowedQuantity = validatedItem?.orderItem?.quantity || 0;

            if (currentQuantity + quantity > maxAllowedQuantity) return;

            const validatedProducts = updatedProducts.map(product => ({
              ...product,
              productData: response.validItems?.find(
                item =>
                  item.orderItem?.productId === product.id &&
                  item.orderItem?.sizeId === Number(product.size)
              )
            }));

            set({
              products: validatedProducts,
              totalItems: validatedProducts.length,
              totalPrice: Number(response.totalSale?.value || 0),
              subTotalPrice: Number(response.subtotal?.value || 0),
            });
          } catch (error) {
            console.error("increaseQuantity failed 💩:", error);
          }
        },

        removeProduct: (productId: number, size: string, index?: number) => {
          const { products } = get();

          if (index !== undefined) {
            const updatedProducts = [
              ...products.slice(0, index),
              ...products.slice(index + 1)
            ];

            set({
              products: updatedProducts,
              totalItems: updatedProducts.length,
            });
            return;
          }

          const productIndex = products.findIndex(
            p => p.id === productId && p.size === size
          );

          if (productIndex === -1) return;

          const updatedProducts = [
            ...products.slice(0, productIndex),
            ...products.slice(productIndex + 1)
          ];

          set({
            products: updatedProducts,
            totalItems: updatedProducts.length,
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
          subTotalPrice: state.subTotalPrice,
        }),
      },
    ),
  );
};
