"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import { createCartStore, defaultInitState } from "./store";
import type { CartStore } from "./store-types";

export type CartStoreApi = ReturnType<typeof createCartStore>;

export const CartStoreContext = createContext<CartStoreApi | undefined>(
  undefined,
);

export interface CartStoreProviderProps {
  children: ReactNode;
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createCartStore(defaultInitState);
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export const useCart = <T,>(selector: (store: CartStore) => T): T => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error(`useCart must be used within CartStoreProvider`);
  }

  return useStore(cartStoreContext, selector);
};
