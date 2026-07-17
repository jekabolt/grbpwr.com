import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { baseSkuOf } from "@/lib/slug-tail";

import { CartProduct, CartState, CartStore } from "./store-types";

const CART_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

type CartPersistedState = Pick<
  CartStore,
  | "products"
  | "totalItems"
  | "totalPrice"
  | "subTotalPrice"
  | "validatedCurrency"
>;

const cartStorageWithTTL: PersistStorage<CartPersistedState> = {
  getItem: (name: string): StorageValue<CartPersistedState> | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { state: unknown; timestamp?: number };
      if (parsed.timestamp && Date.now() - parsed.timestamp > CART_TTL_MS) {
        localStorage.removeItem(name);
        return null;
      }
      return (parsed.state ?? parsed) as StorageValue<CartPersistedState>;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<CartPersistedState>): void => {
    if (typeof window === "undefined") return;
    try {
      const wrapped = JSON.stringify({
        state: value,
        timestamp: Date.now(),
      });
      localStorage.setItem(name, wrapped);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

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
          variantSku: string,
          quantity: number = 1,
          currency?: string,
          maxOrderItems: number = 3,
        ): Promise<boolean> => {
          const { products } = get();

          const baseSku = baseSkuOf(variantSku);
          const existingItemCount = products.filter(
            (p) => baseSkuOf(p.variantSku) === baseSku,
          ).length;

          if (existingItemCount + quantity > maxOrderItems) {
            return false;
          }

          const newItems = Array(quantity)
            .fill(null)
            .map(() => ({ variantSku, quantity }));

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
              (item) => baseSkuOf(item.orderItem?.variantSku) === baseSku,
            );

            const totalValidatedQuantity = validatedItemsForProduct.reduce(
              (sum, item) => sum + (item.orderItem?.quantity || 0),
              0,
            );

            if (totalValidatedQuantity > maxOrderItems) {
              return false;
            }

            const validatedProducts = updatedProducts.map((product) => ({
              ...product,
              productData: response.validItems?.find(
                (item) => item.orderItem?.variantSku === product.variantSku,
              ),
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
            throw error;
          }
        },

        removeProduct: (variantSku: string, index?: number) => {
          const { products } = get();

          let updatedProducts: typeof products;

          if (index !== undefined) {
            updatedProducts = [
              ...products.slice(0, index),
              ...products.slice(index + 1),
            ];
          } else {
            const productIndex = products.findIndex(
              (p) => p.variantSku === variantSku,
            );

            if (productIndex === -1) return;

            updatedProducts = [
              ...products.slice(0, productIndex),
              ...products.slice(productIndex + 1),
            ];
          }

          let newSubTotal = 0;
          let newTotal = 0;

          updatedProducts.forEach((product) => {
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

          // Group by colourway (base SKU) so the per-colourway max still caps a
          // rebuilt cart, then expand each validated line to one row per unit.
          const itemsByColorway = new Map<string, typeof validItems>();
          for (const item of validItems) {
            const variantSku = item.orderItem?.variantSku;
            if (!variantSku) continue;

            const baseSku = baseSkuOf(variantSku);
            if (!itemsByColorway.has(baseSku)) {
              itemsByColorway.set(baseSku, []);
            }
            itemsByColorway.get(baseSku)!.push(item);
          }

          for (const [, colorwayItems] of itemsByColorway) {
            let totalItemsAdded = 0;

            for (const item of colorwayItems) {
              const variantSku = item.orderItem?.variantSku;
              if (!variantSku) continue;

              const backendQty = item.orderItem?.quantity || 0;
              if (backendQty <= 0) continue;

              const remainingLimit = maxOrderItems - totalItemsAdded;
              if (remainingLimit <= 0) break;

              const itemsToAdd = Math.min(backendQty, remainingLimit);
              if (itemsToAdd <= 0) continue;

              const newProducts = Array.from({ length: itemsToAdd }, () => ({
                variantSku,
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

            const validatedProducts = products.map((product) => ({
              ...product,
              productData: response.validItems?.find(
                (item) => item.orderItem?.variantSku === product.variantSku,
              ),
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
        storage: cartStorageWithTTL,
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
