import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr', 'de', 'it', 'ja', 'zh', 'ko'],
    defaultLocale: 'en',
    localePrefix: 'always',
    // We persist language in NEXT_LOCALE from custom country/locale middleware.
    // next-intl uses the same cookie name by default; Link/router syncLocaleCookie
    // can overwrite NEXT_LOCALE on the client, so reload falls back to the old locale.
    // Locale is always in the URL (localePrefix: 'always'); cookie is not needed for detection.
    localeCookie: false,
});