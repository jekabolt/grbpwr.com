
export interface TranslationsState {
    languageId: number;
    currentCountry: {
        name: string;
        countryCode: string;
    };
    nextCountry: {
        name: string;
        countryCode: string;
    };
}

export interface TranslationsActions {
    setLanguageId: (languageId: number) => void;
    setNextCountry: (country: { name: string; countryCode: string }) => void;
    applyNextCountry: () => void;
    cancelNextCountry: () => void;
    setCurrentCountry: (country: { name: string; countryCode: string }) => void;
}

export type TranslationsStore = TranslationsState & TranslationsActions;
