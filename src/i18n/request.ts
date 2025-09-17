import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;

    // Get country and locale from headers (set by middleware)
    const headersList = await headers();
    const country = headersList.get('x-country');
    const localeFromHeader = headersList.get('x-locale');

    // Use locale from header if available, otherwise fall back to requested or default
    const locale = localeFromHeader || (hasLocale(routing.locales, requested) ? requested : routing.defaultLocale);

    console.log(`Request config: requested=${requested}, locale=${locale}, country=${country}, localeFromHeader=${localeFromHeader}`);

    return {
        locale,
        country: country || locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});     