import { common_CurrencyRate } from "@/api/proto-http/frontend";

export interface CurrencyState {
    selectedCurrency: string;
    rates: { [key: string]: common_CurrencyRate } | undefined;
}

export interface CurrencyActions {
    setSelectedCurrency: (currency: string) => void;
    convertPrice: (amount: string) => string;
}

export type CurrencyStore = CurrencyState & CurrencyActions