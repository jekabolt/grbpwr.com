
import type { common_CurrencyRate } from "@/api/proto-http/frontend";

export interface TranslationsState {
    languageId: number;
    currentCountry: {
        name: string;
        countryCode: string;
        currencyKey?: string;
    };
    nextCountry: {
        name: string;
        countryCode: string;
        currencyKey?: string;
    };
    isOpen: boolean;
    rates?: { [key: string]: common_CurrencyRate } | undefined;
}

export interface TranslationsActions {
    openCountryPopup: () => void;
    closeCountryPopup: () => void;
    setLanguageId: (languageId: number) => void;
    setNextCountry: (country: {
        name: string;
        countryCode: string;
        currency?: string;
        currencyKey?: string;
    }) => void;
    applyNextCountry: () => void;
    cancelNextCountry: () => void;
    setCurrentCountry: (country: Partial<{
        name: string;
        countryCode: string;
        currency?: string;
        currencyKey?: string;
    }>) => void;
}

export type TranslationsStore = TranslationsState & TranslationsActions;
