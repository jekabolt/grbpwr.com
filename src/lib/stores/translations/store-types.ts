
export interface TranslationsState {
    languageId: number;
    currentCountry: {
        name: string;
        countryCode: string;
        currency?: string;
        currencyKey?: string;
    };
    nextCountry: {
        name: string;
        countryCode: string;
        currency?: string;
        currencyKey?: string;
    };
    isOpen: boolean;
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
    setCurrentCountry: (country: {
        name: string;
        countryCode: string;
        currency?: string;
        currencyKey?: string;
    }) => void;
}

export type TranslationsStore = TranslationsState & TranslationsActions;
