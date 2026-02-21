import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { validateCartItems } from "@/lib/cart/validate-cart-items";

import { CartProduct, CartState, CartStore } from "./store-types";

export const defaultInitState: CartState = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
  subTotalPrice: 0,
  isOpen: false,
  productToRemove: null,
  validatedCurrency: "EUR",
  isRevalidating: false,
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
          currency?: string,
          maxOrderItems: number = 3,
        ): Promise<boolean> => {
          const { products } = get();

          const existingItemCount = products.filter(
            p => p.id === productId
          ).length;

          if (existingItemCount + quantity > maxOrderItems) {
            return false;
          }

          const newItems = Array(quantity)
            .fill(null)
            .map(() => ({ id: productId, size, quantity }));

          const updatedProducts = [...products, ...newItems];

          let currencyToUse = currency;
          if (!currencyToUse && typeof window !== "undefined") {
            try {
              const currencyStorage = localStorage.getItem("currency-store");
              if (currencyStorage) {
                const parsed = JSON.parse(currencyStorage);
                currencyToUse = parsed?.state?.selectedCurrency || "EUR";
              } else {
                currencyToUse = "EUR";
              }
            } catch {
              currencyToUse = "EUR";
            }
          }
          currencyToUse = currencyToUse || "EUR";

          try {
            const result = await validateCartItems({
              products: updatedProducts,
              currency: currencyToUse,
            });

            if (!result) {
              return false;
            }

            const { response } = result;

            const validatedItemsForProduct = (response.validItems || []).filter(
              item => item.orderItem?.productId === productId
            );

            const totalValidatedQuantity = validatedItemsForProduct.reduce(
              (sum, item) => sum + (item.orderItem?.quantity || 0),
              0
            );

            if (totalValidatedQuantity > maxOrderItems) {
              return false;
            }

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
              validatedCurrency: currencyToUse,
            });
            return true;
          } catch (error) {
            console.error("increaseQuantity failed 💩:", error);
            return false;
          }
        },

        removeProduct: (productId: number, size: string, index?: number) => {
          const { products } = get();

          let updatedProducts: typeof products;

          if (index !== undefined) {
            updatedProducts = [
              ...products.slice(0, index),
              ...products.slice(index + 1)
            ];
          } else {
            const productIndex = products.findIndex(
              p => p.id === productId && p.size === size
            );

            if (productIndex === -1) return;

            updatedProducts = [
              ...products.slice(0, productIndex),
              ...products.slice(productIndex + 1)
            ];
          }

          let newSubTotal = 0;
          let newTotal = 0;

          updatedProducts.forEach(product => {
            if (product.productData) {
              const priceWithSale = product.productData.productPriceWithSale;
              const regularPrice = product.productData.productPrice;

              if (priceWithSale) {
                newTotal += parseFloat(priceWithSale);
                newSubTotal += parseFloat(priceWithSale);
              } else if (regularPrice) {
                newTotal += parseFloat(regularPrice);
                newSubTotal += parseFloat(regularPrice);
              }
            }
          });

          set({
            products: updatedProducts,
            totalItems: updatedProducts.length,
            totalPrice: newTotal,
            subTotalPrice: newSubTotal,
          });
        },

        syncWithValidatedItems: (
          validationResponse: ValidateOrderItemsInsertResponse,
          maxOrderItems: number = 3,
        ) => {
          const { validItems, totalSale, subtotal } = validationResponse;

          if (!validItems || validItems.length === 0) {
            set({
              products: [],
              totalItems: 0,
              totalPrice: 0,
              subTotalPrice: 0,
            });
            return;
          }

          let rebuiltProducts: CartProduct[] = [];

          const itemsByProduct = new Map<number, typeof validItems>();
          for (const item of validItems) {
            const orderItem = item.orderItem;
            if (!orderItem?.productId || !orderItem.sizeId) continue;

            const productId = orderItem.productId;
            if (!itemsByProduct.has(productId)) {
              itemsByProduct.set(productId, []);
            }
            itemsByProduct.get(productId)!.push(item);
          }

          for (const [productId, productItems] of itemsByProduct) {
            let totalItemsAdded = 0;

            for (const item of productItems) {
              const orderItem = item.orderItem;
              if (!orderItem?.sizeId) continue;

              const backendQty = orderItem.quantity || 0;
              if (backendQty <= 0) continue;

              const remainingLimit = maxOrderItems - totalItemsAdded;
              if (remainingLimit <= 0) break;

              const itemsToAdd = Math.min(backendQty, remainingLimit);
              if (itemsToAdd <= 0) continue;

              const newProducts = Array.from({ length: itemsToAdd }, () => ({
                id: productId,
                size: String(orderItem.sizeId),
                quantity: 1,
                productData: item,
              }));

              rebuiltProducts.push(...newProducts);
              totalItemsAdded += itemsToAdd;

              if (totalItemsAdded >= maxOrderItems) break;
            }
          }

          set({
            products: rebuiltProducts,
            totalItems: rebuiltProducts.length,
            totalPrice: Number(totalSale?.value || 0),
            subTotalPrice: Number(subtotal?.value || 0),
          });
        },

        revalidateCart: async (currency: string) => {
          const { products } = get();

          if (products.length === 0) {
            set({ validatedCurrency: currency });
            return;
          }

          set({ isRevalidating: true });

          try {
            const result = await validateCartItems({
              products,
              currency,
            });

            if (!result) {
              set({ isRevalidating: false });
              return;
            }

            const { response } = result;

            const validatedProducts = products.map(product => ({
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
              validatedCurrency: currency,
              isRevalidating: false,
            });
          } catch (error) {
            console.error("revalidateCart failed 💩:", error);
            set({ isRevalidating: false });
          }
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
          validatedCurrency: state.validatedCurrency,
        }),
      },
    ),
  );
};
