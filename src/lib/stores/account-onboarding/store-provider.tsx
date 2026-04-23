"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import {
  createAccountOnboardingStore,
  type CreateAccountOnboardingStoreOptions,
} from "./store";
import type { AccountOnboardingStore } from "./store-types";

export type AccountOnboardingStoreApi = ReturnType<typeof createAccountOnboardingStore>;

const AccountOnboardingStoreContext = createContext<
  AccountOnboardingStoreApi | undefined
>(undefined);

export type AccountOnboardingStoreProviderProps = CreateAccountOnboardingStoreOptions & {
  children: ReactNode;
};

export function AccountOnboardingStoreProvider({
  initialSignedIn,
  initialAccount,
  children,
}: AccountOnboardingStoreProviderProps) {
  const storeRef = useRef<AccountOnboardingStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createAccountOnboardingStore({ initialSignedIn, initialAccount });
  }

  useEffect(() => {
    storeRef.current?.getState().setSignedIn(initialSignedIn);
    storeRef.current?.getState().setAccount(initialAccount);
  }, [initialSignedIn, initialAccount]);

  return (
    <AccountOnboardingStoreContext.Provider value={storeRef.current}>
      {children}
    </AccountOnboardingStoreContext.Provider>
  );
}

export function useAccountOnboardingStore<T>(
  selector: (store: AccountOnboardingStore) => T,
): T {
  const api = useContext(AccountOnboardingStoreContext);
  if (!api) {
    throw new Error(
      "useAccountOnboardingStore must be used within AccountOnboardingStoreProvider",
    );
  }
  return useStore(api, selector);
}
