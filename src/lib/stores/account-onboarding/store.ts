import { createStore } from "zustand/vanilla";

import type { AccountOnboardingStore } from "./store-types";

export type CreateAccountOnboardingStoreOptions = {
  initialSignedIn: boolean;
};

export function createAccountOnboardingStore({
  initialSignedIn,
}: CreateAccountOnboardingStoreOptions) {
  return createStore<AccountOnboardingStore>()((set) => ({
    isSignedIn: initialSignedIn,
    setSignedIn: (isSignedIn) => set({ isSignedIn }),
  }));
}
