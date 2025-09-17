import { countries, isValidCountryLocale, routing } from '@/i18n/routing';

export function createCountryLocaleUrl(
    pathname: string,
    country: string,
    locale: string
): string {
    // Validate inputs
    if (!isValidCountryLocale(country, locale)) {
        throw new Error(`Invalid country/locale combination: ${country}/${locale}`);
    }

    // Remove leading slash if present
    const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

    // Remove existing locale prefix if present
    const pathWithoutLocale = routing.locales.some(loc =>
        cleanPath.startsWith(`${loc}/`) || cleanPath === loc
    ) ? cleanPath.replace(/^[^/]+\//, '') : cleanPath;

    // Construct the new URL with country/locale prefix
    return `/${country}/${locale}/${pathWithoutLocale}`.replace(/\/+/g, '/').replace(/\/$/, '') || `/${country}/${locale}`;
}

export function getCountryFromUrl(pathname: string): string | null {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 1 && countries.includes(segments[0])) {
        return segments[0];
    }
    return null;
}

export function getLocaleFromUrl(pathname: string): string | null {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2 && routing.locales.includes(segments[1] as any)) {
        return segments[1];
    }
    return null;
}
