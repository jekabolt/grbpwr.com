import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TranslationsState, TranslationsStore } from "./store-types";



export const defaultInitState: TranslationsState = {
    languageId: 1, // english
    currentCountry: { name: "united states", countryCode: "US" },
    nextCountry: { name: "", countryCode: "" },
};

export const createTranslationsStore = (initState: TranslationsState = defaultInitState) => {
    return createStore<TranslationsStore>()(
        persist(
            (set, get) => ({
                ...initState,

                setLanguageId: (languageId: number) => set({ languageId }),
                setNextCountry: (country: { name: string; countryCode: string }) =>
                    set({ nextCountry: country }),
                applyNextCountry: () => {
                    const { nextCountry, languageId } = get();
                    if (nextCountry.name && nextCountry.countryCode) {
                        set({
                            currentCountry: nextCountry,
                            nextCountry: { name: "", countryCode: "" }
                        });
                    }
                },
                setCurrentCountry: (country: { name: string; countryCode: string }) =>
                    set({ currentCountry: country }),
                cancelNextCountry: () =>
                    set({ nextCountry: { name: "", countryCode: "" } }),
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
                    currentCountry: state.currentCountry,
                    nextCountry: state.nextCountry,
                }),
            }
        )
    )
}
