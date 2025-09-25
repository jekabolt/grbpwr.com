import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cookieStorage } from "./cookie-storage";
import { TranslationsState, TranslationsStore } from "./store-types";
import { syncWithMiddlewareCookies } from "./translation-sync";



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

                syncWithMiddleware: () => {
                    const synced = syncWithMiddlewareCookies();
                    const currentState = get();

                    if (synced.country?.countryCode !== currentState.country.countryCode ||
                        synced.languageId !== currentState.languageId) {
                        set({
                            ...(synced.country && { country: synced.country }),
                            ...(synced.languageId !== undefined && { languageId: synced.languageId }),
                        });
                    }
                },
            }),
            {
                name: "translations-store",
                storage: createJSONStorage(() => cookieStorage),
                skipHydration: true,
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
