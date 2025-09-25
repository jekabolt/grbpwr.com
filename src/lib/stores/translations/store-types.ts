import { common_Language } from "@/api/proto-http/frontend";

export interface TranslationsState {
    languageId: number;
    country: {
        name: string;
        countryCode: string;
    };
    translations: { [key: string]: common_Language } | undefined;
}

export interface TranslationsActions {
    setLanguageId: (languageId: number) => void;
    setCountry: (country: { name: string; countryCode: string }) => void;
}

export type TranslationsStore = TranslationsState & TranslationsActions;
