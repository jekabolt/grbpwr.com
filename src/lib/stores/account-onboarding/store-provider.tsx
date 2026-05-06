"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import {
  resolveAccountSession,
  storefrontAccountToProfile,
} from "@/lib/storefront-account/client-session";

import {
  createAccountOnboardingStore,
  type CreateAccountOnboardingStoreOptions,
} from "./store";
import type { AccountOnboardingStore } from "./store-types";

export type AccountOnboardingStoreApi = ReturnType<typeof createAccountOnboardingStore>;

const AccountOnboardingStoreContext = createContext<
  AccountOnboardingStoreApi | undefined
>(undefined);

const SESSION_RECHECK_INTERVAL_MS = 60_000;

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

  useEffect(() => {
    let active = true;
    let lastCheckedAt = 0;

    async function hydrateSession() {
      lastCheckedAt = Date.now();
      const account = await resolveAccountSession();
      if (!active) return;

      const state = storeRef.current?.getState();
      if (!state) return;

      if (!account) {
        state.setSignedIn(false);
        state.setAccount(null);
        return;
      }

      state.setSignedIn(true);
      state.setAccount(storefrontAccountToProfile(account));
    }

    function hydrateIfStale() {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheckedAt < SESSION_RECHECK_INTERVAL_MS) return;
      void hydrateSession();
    }

    void hydrateSession();

    window.addEventListener("focus", hydrateIfStale);
    document.addEventListener("visibilitychange", hydrateIfStale);

    return () => {
      active = false;
      window.removeEventListener("focus", hydrateIfStale);
      document.removeEventListener("visibilitychange", hydrateIfStale);
    };
  }, []);

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
