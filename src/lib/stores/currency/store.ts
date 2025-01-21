import { persist } from "zustand/middleware";

import { common_CurrencyRate } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { createStore } from "zustand";
import { CurrencyState, CurrencyStore } from "./store-types";

export const defaultInitState: CurrencyState = {
    selectedCurrency: "",
    rates: undefined,
    baseCurrency: "",
};

export const createCurrencyStore = (initState: CurrencyState = defaultInitState) => {
    return createStore<CurrencyStore>()(
        persist(
            (set, get) => ({
                ...initState,
                setSelectedCurrency: (currency: string) => {
                    set({ selectedCurrency: currency });
                },
                setRates: (rates: { [key: string]: common_CurrencyRate }) => {
                    set({ rates });
                },
                setBaseCurrency: (currency: string) => {
                    set({ baseCurrency: currency });
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
                getCurrencySymbols: () => {
                    const { selectedCurrency } = get();
                    return currencySymbols[selectedCurrency] || selectedCurrency;
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
