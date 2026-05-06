import { createStore } from "zustand/vanilla";

import type { AccountOnboardingStore, AccountProfile } from "./store-types";

export type CreateAccountOnboardingStoreOptions = {
  initialSignedIn: boolean;
  initialAccount: AccountProfile | null;
};

export function createAccountOnboardingStore({
  initialSignedIn,
  initialAccount,
}: CreateAccountOnboardingStoreOptions) {
  return createStore<AccountOnboardingStore>()((set) => ({
    isSignedIn: initialSignedIn,
    account: initialAccount,
    setSignedIn: (isSignedIn) => set({ isSignedIn }),
    setAccount: (account) => set({ account }),
  }));
}
