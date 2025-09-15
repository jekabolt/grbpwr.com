import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { TranslationsState, TranslationsStore } from "./store-types";

export const defaultInitState: TranslationsState = {
    languageId: 1, // English (en)
    country: { name: "united states", countryCode: "US" },
    translations: undefined,
};



export const createTranslationsStore = (initState: TranslationsState = defaultInitState) => {
    return createStore<TranslationsStore>()(
        persist(
            (set, get) => ({
                ...initState,

                setLanguageId: (languageId: number) => set({ languageId: languageId }),
                setCountry: (country: { name: string; countryCode: string }) => set({ country: country }),
            }),
            {
                name: "translations-store",
                partialize: (state) => ({
                    languageId: state.languageId,
                    country: state.country,
                }),
            }
        )
    )
}