import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
    localePrefix: 'always'
});

// Define supported countries
export const countries = ['fr', 'de'];

// Define allowed country/locale combinations
export const allowedCombinations = [
    { country: 'fr', locale: 'fr' },
    { country: 'fr', locale: 'en' },
    { country: 'de', locale: 'de' },
    { country: 'de', locale: 'en' }
];

// Helper function to validate country/locale combination
export function isValidCountryLocale(country: string, locale: string): boolean {
    return allowedCombinations.some(combo =>
        combo.country === country && combo.locale === locale
    );
}

// Get all available combinations
export function getAvailableCombinations() {
    return allowedCombinations;
}

// Get available locales for a specific country
export function getLocalesForCountry(country: string): string[] {
    return allowedCombinations
        .filter(combo => combo.country === country)
        .map(combo => combo.locale);
}

// Get available countries for a specific locale
export function getCountriesForLocale(locale: string): string[] {
    return allowedCombinations
        .filter(combo => combo.locale === locale)
        .map(combo => combo.country);
}