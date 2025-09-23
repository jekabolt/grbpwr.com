import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr', 'de', 'it', 'ja', 'cn', 'kr'],
    defaultLocale: 'en',
    localePrefix: 'always'
});