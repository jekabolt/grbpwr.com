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
  initialCountry,
  initialLanguageId,
}: {
  children: React.ReactNode;
  initialCountry?: { name: string; countryCode: string };
  initialLanguageId?: number;
}) => {
  const storeRef = useRef<TranslationsStoreApi>(null);
  if (!storeRef.current) {
    const initState = {
      ...defaultInitState,
      ...(initialCountry && { currentCountry: initialCountry }),
      ...(initialLanguageId && { languageId: initialLanguageId }),
    };
    storeRef.current = createTranslationsStore(initState);
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
