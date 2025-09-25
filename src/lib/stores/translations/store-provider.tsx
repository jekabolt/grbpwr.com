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

  // Добавляем синхронизацию после mount
  useEffect(() => {
    if (storeRef.current) {
      // Сначала rehydrate store
      storeRef.current.persist.rehydrate();

      // Затем синхронизируем с middleware cookies
      const syncTimeout = setTimeout(() => {
        storeRef.current?.getState().syncWithMiddleware();
      }, 100);

      // Слушаем изменения cookies через navigation events
      const handleNavigation = () => {
        storeRef.current?.getState().syncWithMiddleware();
      };

      // Слушаем popstate (back/forward navigation)
      window.addEventListener("popstate", handleNavigation);

      // Опционально: слушаем focus для синхронизации между табами
      window.addEventListener("focus", handleNavigation);

      return () => {
        clearTimeout(syncTimeout);
        window.removeEventListener("popstate", handleNavigation);
        window.removeEventListener("focus", handleNavigation);
      };
    }
  }, []);

  // Синхронизация при изменении пути (client-side навигация App Router)
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
