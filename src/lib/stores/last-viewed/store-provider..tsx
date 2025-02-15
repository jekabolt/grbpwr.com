"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import { createLastViewedStore, defaultInitState } from "./store";
import type { LastViewedStore } from "./store-types";

export type LastViewedStoreApi = ReturnType<typeof createLastViewedStore>;

export const LastViewedStoreContext = createContext<
  LastViewedStoreApi | undefined
>(undefined);

export interface LastViewedStoreProviderProps {
  children: ReactNode;
}

export const LastViewedStoreProvider = ({
  children,
}: LastViewedStoreProviderProps) => {
  const storeRef = useRef<LastViewedStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createLastViewedStore(defaultInitState);
  }

  return (
    <LastViewedStoreContext.Provider value={storeRef.current}>
      {children}
    </LastViewedStoreContext.Provider>
  );
};

export const useLastViewed = <T,>(
  selector: (store: LastViewedStore) => T,
): T => {
  const lastViewedStoreContext = useContext(LastViewedStoreContext);

  if (!lastViewedStoreContext) {
    throw new Error(
      `useLastViewed must be used within LastViewedStoreProvider`,
    );
  }

  return useStore(lastViewedStoreContext, selector);
};
