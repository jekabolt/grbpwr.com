import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TranslationsState, TranslationsStore } from "./store-types";



export const defaultInitState: TranslationsState = {
    languageId: 1, // english
    country: { name: "united states", countryCode: "US" },
    translations: undefined,
};

export const createTranslationsStore = (initState: TranslationsState = defaultInitState) => {
    return createStore<TranslationsStore>()(
        persist(
            (set, get) => ({
                ...initState,

                setLanguageId: (languageId: number) => set({ languageId }),
                setCountry: (country: { name: string; countryCode: string }) => set({ country }),
            }),
            {
                name: "translations-store",
                storage: createJSONStorage(() => localStorage),
                merge: (persistedState, currentState) => {
                    const persisted = persistedState as Partial<TranslationsState> | undefined;
                    const current = currentState as TranslationsStore;
                    return { ...current, ...(persisted || {}) } as TranslationsStore;
                },
                partialize: (state) => ({
                    languageId: state.languageId,
                    country: state.country,
                }),
            }
        )
    )
}
