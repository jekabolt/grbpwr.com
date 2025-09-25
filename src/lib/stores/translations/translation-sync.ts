import { COUNTRIES_BY_REGION, LANGUAGE_CODE_TO_ID } from '@/constants';
import { CountryInfo } from './cookie-utils';

interface SyncedState {
    country?: CountryInfo;
    languageId?: number;
}

export function syncWithMiddlewareCookies(): SyncedState {
    if (typeof window === 'undefined') return {};

    const countryCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_COUNTRY='))
        ?.split('=')[1]?.toLowerCase();

    const localeCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

    if (!countryCookie || !localeCookie) {
        return {};
    }

    // Используем ту же логику из вашего getInitialTranslationState
    for (const [, countries] of Object.entries(COUNTRIES_BY_REGION)) {
        const country = countries.find(c =>
            c.countryCode.toLowerCase() === countryCookie && c.lng === localeCookie
        );

        if (country) {
            return {
                country: {
                    name: country.name,
                    countryCode: country.countryCode,
                },
                languageId: LANGUAGE_CODE_TO_ID[country.lng],
            };
        }
    }

    return {};
}
