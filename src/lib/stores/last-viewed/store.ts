import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { LastViewedState, LastViewedStore } from "./store-types";

export const defaultInitState: LastViewedState = {
  products: [],
};

export const createLastViewedStore = (
  initState: LastViewedState = defaultInitState,
) => {
  return createStore<LastViewedStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addProduct: (product) => {
          const { products } = get();
          const updatedProducts = [
            product,
            ...products.filter((p) => p.id !== product.id),
          ].slice(0, 5);
          set({ products: updatedProducts });
        },
        clearLastViewed: () => {
          set(defaultInitState);
        },
      }),
      {
        name: "last-viewed-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          products: state.products,
        }),
      },
    ),
  );
};
