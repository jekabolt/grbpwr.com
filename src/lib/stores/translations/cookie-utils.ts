import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from "@/constants";
import { cookies, headers } from "next/headers";

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
    const headersList = await headers();
    // Middleware sets x-nextjs-country/locale from the URL path on every request.
    // These headers are the source of truth — cookies may be stale when a
    // from_picker redirect's Set-Cookie hasn't been committed yet (mobile Safari).
    const headerCountry = headersList.get("x-nextjs-country")?.toLowerCase();
    const headerLocale = headersList.get("x-nextjs-locale");

    const countryCookie = headerCountry
        ?? cookieStore.get("NEXT_COUNTRY")?.value?.toLowerCase();
    const localeCookie = headerLocale
        ?? cookieStore.get("NEXT_LOCALE")?.value;

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
