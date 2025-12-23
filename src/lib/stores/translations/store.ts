import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TranslationsState, TranslationsStore } from "./store-types";

export const defaultInitState: TranslationsState = {
    languageId: 1, // english
    currentCountry: {
        name: "united states",
        countryCode: "US",
        currencyKey: "USD",
    },
    nextCountry: {
        name: "",
        countryCode: "",
        currencyKey: undefined,
    },
    isOpen: false,
    rates: undefined,
};

export const createTranslationsStore = (initState: TranslationsState = defaultInitState) => {
    return createStore<TranslationsStore>()(
        persist(
            (set, get) => ({
                ...initState,

                openCountryPopup: () => set({ isOpen: true }),
                closeCountryPopup: () => set({ isOpen: false }),

                setLanguageId: (languageId: number) => set({ languageId }),
                setNextCountry: (country) => set({ nextCountry: country }),
                applyNextCountry: () => {
                    const { nextCountry } = get();
                    if (nextCountry.name && nextCountry.countryCode) {
                        set({
                            currentCountry: nextCountry,
                            nextCountry: {
                                name: "",
                                countryCode: "",
                                currencyKey: undefined,
                            },
                        });
                    }
                },
                setCurrentCountry: (country) =>
                    set(({ currentCountry }) => ({
                        currentCountry: {
                            ...currentCountry,
                            ...country,
                        },
                    })),
                cancelNextCountry: () =>
                    set({
                        nextCountry: {
                            name: "",
                            countryCode: "",
                            currencyKey: undefined,
                        },
                    }),

                // Price conversion based on selected currency (moved from currency store, currently disabled)
                // convertPrice: (amount: string) => {
                //   const { rates, selectedCurrency } = get();
                //
                //   if (!amount || !rates || !selectedCurrency) {
                //     return amount || "0";
                //   }
                //
                //   const targetRate = rates[selectedCurrency];
                //
                //   if (!targetRate?.rate?.value) {
                //     return amount;
                //   }
                //
                //   const baseAmount = parseFloat(amount);
                //   const rate = parseFloat(targetRate.rate.value);
                //   return (baseAmount * rate).toFixed(2);
                // },
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
                    rates: state.rates,
                }),
            },
        ),
    );
};
