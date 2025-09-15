import { common_CurrencyRate } from "@/api/proto-http/frontend";

export interface CurrencyState {
    selectedCurrency: string;
    rates: { [key: string]: common_CurrencyRate } | undefined;
    isOpen: boolean
}

export interface CurrencyActions {
    openCurrencyPopup: () => void;
    closeCurrencyPopup: () => void;
    setSelectedCurrency: (currency: string) => void;
    convertPrice: (amount: string) => string;
}

export type CurrencyStore = CurrencyState & CurrencyActions