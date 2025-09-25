"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createTranslationsStore, defaultInitState } from "./store";
import { TranslationsStore } from "./store-types";

type TranslationsStoreApi = ReturnType<typeof createTranslationsStore>;

const TranslationsStoreContext = createContext<
  TranslationsStoreApi | undefined
>(undefined);

export const TranslationsStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<TranslationsStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createTranslationsStore(defaultInitState);
  }

  return (
    <TranslationsStoreContext.Provider value={storeRef.current}>
      {children}
    </TranslationsStoreContext.Provider>
  );
};

export const useTranslationsStore = <T,>(
  selector: (store: TranslationsStore) => T,
): T => {
  const store = useContext(TranslationsStoreContext);
  if (!store) {
    throw new Error("TranslationsStoreContext not found");
  }
  return useStore(store, selector);
};
