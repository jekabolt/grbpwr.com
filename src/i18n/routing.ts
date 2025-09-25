import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr', 'de', 'it', 'ja', 'zh', 'ko'],
    defaultLocale: 'en',
    localePrefix: 'always'
});