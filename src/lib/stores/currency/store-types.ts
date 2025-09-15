import { common_CurrencyRate } from "@/api/proto-http/frontend";

export interface CurrencyState {
    selectedCurrency: string;
    selectedLanguage: { code: string; id: number };
    rates: { [key: string]: common_CurrencyRate } | undefined;
    isOpen: boolean
}

export interface CurrencyActions {
    openCurrencyPopup: () => void;
    closeCurrencyPopup: () => void;
    setSelectedCurrency: (currency: string) => void;
    setSelectedLanguage: (lng: { code: string; id: number }) => void;
    convertPrice: (amount: string) => string;
}

export type CurrencyStore = CurrencyState & CurrencyActions