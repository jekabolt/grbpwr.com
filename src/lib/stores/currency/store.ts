import { persist } from "zustand/middleware";

import { createStore } from "zustand";
import { CurrencyState, CurrencyStore } from "./store-types";

export const defaultInitState: CurrencyState = {
    selectedCurrency: "EUR",
    rates: undefined,
    baseCurrency: "EUR",
};

export const createCurrencyStore = (initState: CurrencyState = defaultInitState) => {
    return createStore<CurrencyStore>()(
        persist(
            (set, get) => ({
                ...initState,
                setSelectedCurrency: (currency: string) => {
                    set({ selectedCurrency: currency });
                },
                convertPrice: (amount: string) => {
                    const { rates, selectedCurrency } = get();

                    if (!amount || !rates || !selectedCurrency) {
                        return amount || "0";
                    }

                    const targetRate = rates[selectedCurrency];

                    if (!targetRate?.rate?.value) {
                        return amount;
                    }

                    const baseAmount = parseFloat(amount);
                    const rate = parseFloat(targetRate.rate.value);
                    return (baseAmount * rate).toFixed(2);
                },
            }),
            {
                name: "currency-store",
                partialize: (state) => ({
                    selectedCurrency: state.selectedCurrency,
                }),
            },
        ),
    );
};
