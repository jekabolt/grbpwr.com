import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { CheckoutState, CheckoutStore } from "./store-types";

export const defaultInitState: CheckoutState = {
    formData: {},
    hasPersistedData: false,
    rehydrated: false,
};

export const createCheckoutStore = (initState: CheckoutState = defaultInitState) => {
    return createStore<CheckoutStore>()(
        persist(
            (set, get) => ({
                ...initState,

                updateFormData: (data) => {
                    const { formData } = get();
                    set({
                        formData: { ...formData, ...data },
                        hasPersistedData: true,
                    });
                },

                clearFormData: () => {
                    set({
                        formData: {},
                        hasPersistedData: false,
                    });
                },

                resetStore: () => {
                    set(defaultInitState);
                },
            }),
            {
                name: "checkout-form-storage",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    formData: state.formData,
                    hasPersistedData: state.hasPersistedData,
                }),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        state.rehydrated = true;
                        if (Object.keys(state.formData).length > 0) {
                            state.hasPersistedData = true;
                        }
                    }
                },
            },
        ),
    );
}; 
