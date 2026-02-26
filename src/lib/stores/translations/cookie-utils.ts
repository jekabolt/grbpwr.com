import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";
import { cookies } from "next/headers";

export interface CountryInfo {
    name: string;
    countryCode: string;
    currency?: string;
    currencyKey?: string;
}

export interface InitialTranslationState {
    country?: CountryInfo;
    languageId?: number;
}

export async function getInitialTranslationState(): Promise<InitialTranslationState> {
    const cookieStore = await cookies();
    const countryCookie = cookieStore.get("NEXT_COUNTRY")?.value?.toLowerCase();
    const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

    if (!countryCookie || !localeCookie) {
        return {};
    }

    let countryInfo: CountryInfo | undefined;
    let languageId: number | undefined;

    // Find country by countryCode (locale can differ from country's default, e.g. /us/de)
    for (const [, countries] of Object.entries(COUNTRIES_BY_REGION)) {
        const country = countries.find(
            (c) => c.countryCode.toLowerCase() === countryCookie,
        );

        if (country) {
            countryInfo = {
                name: country.name,
                countryCode: country.countryCode,
                currency: country.currency,
                currencyKey: country.currencyKey,
            };
            // Use locale from cookie, not country's default (preserves user's language choice)
            languageId = LANGUAGE_CODE_TO_ID[localeCookie];
            if (languageId === undefined) {
                languageId = LANGUAGE_CODE_TO_ID[country.lng];
            }
            break;
        }
    }

    return {
        country: countryInfo,
        languageId,
    };
}
