"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import { createCheckoutStore, defaultInitState } from "./store";
import { type CheckoutStore } from "./store-types";

export type CheckoutStoreApi = ReturnType<typeof createCheckoutStore>;

export const CheckoutStoreContext = createContext<CheckoutStoreApi | undefined>(
  undefined,
);

export interface CheckoutStoreProviderProps {
  children: ReactNode;
}

export const CheckoutStoreProvider = ({
  children,
}: CheckoutStoreProviderProps) => {
  const storeRef = useRef<CheckoutStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createCheckoutStore(defaultInitState);
  }

  return (
    <CheckoutStoreContext.Provider value={storeRef.current}>
      {children}
    </CheckoutStoreContext.Provider>
  );
};

export const useCheckoutStore = <T,>(
  selector: (store: CheckoutStore) => T,
): T => {
  const checkoutStoreContext = useContext(CheckoutStoreContext);

  if (!checkoutStoreContext) {
    throw new Error(
      `useCheckoutStore must be used within CheckoutStoreProvider`,
    );
  }

  return useStore(checkoutStoreContext, selector);
};
