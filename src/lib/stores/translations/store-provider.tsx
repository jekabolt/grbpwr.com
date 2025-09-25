"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  if (!storeRef.current) {
    const initState = {
      ...defaultInitState,
      ...(initialCountry && { country: initialCountry }),
      ...((initialLanguageId ?? undefined) !== undefined && {
        languageId: initialLanguageId,
      }),
    };
    storeRef.current = createTranslationsStore(initState);
  }

  useEffect(() => {
    if (storeRef.current) {
      const result = storeRef.current.persist.rehydrate();
      const doSync = () => storeRef.current?.getState().syncWithMiddleware();
      if (result && typeof (result as any).then === "function") {
        (result as Promise<void>).then(doSync);
      } else {
        doSync();
      }

      const handleNavigation = () => {
        storeRef.current?.getState().syncWithMiddleware();
      };

      window.addEventListener("popstate", handleNavigation);

      window.addEventListener("focus", handleNavigation);

      return () => {
        window.removeEventListener("popstate", handleNavigation);
        window.removeEventListener("focus", handleNavigation);
      };
    }
  }, []);

  useEffect(() => {
    if (!storeRef.current) return;
    storeRef.current.getState().syncWithMiddleware();
  }, [pathname]);

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
