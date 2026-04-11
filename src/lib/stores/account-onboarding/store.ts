import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { AccountOnboardingState, AccountOnboardingStore } from "./store-types";

export const defaultOnboardingFields: Pick<
  AccountOnboardingState,
  "privacy" | "phonePrompt" | "birthDatePrompt" | "rehydrated"
> = {
  privacy: "pending",
  phonePrompt: "pending",
  birthDatePrompt: "pending",
  rehydrated: false,
};

export type CreateAccountOnboardingStoreOptions = {
  initialSignedIn: boolean;
};

export function createAccountOnboardingStore({
  initialSignedIn,
}: CreateAccountOnboardingStoreOptions) {
  return createStore<AccountOnboardingStore>()(
    persist(
      (set) => ({
        isSignedIn: initialSignedIn,
        ...defaultOnboardingFields,

        setSignedIn: (isSignedIn) => set({ isSignedIn }),

        setPrivacy: (privacy) => set({ privacy }),

        setPhonePrompt: (phonePrompt) => set({ phonePrompt }),

        setBirthDatePrompt: (birthDatePrompt) => set({ birthDatePrompt }),

        resetOnboarding: () =>
          set({
            ...defaultOnboardingFields,
            rehydrated: true,
          }),
      }),
      {
        name: "account-onboarding",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          privacy: state.privacy,
          phonePrompt: state.phonePrompt,
          birthDatePrompt: state.birthDatePrompt,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.rehydrated = true;
          }
        },
      },
    ),
  );
}
