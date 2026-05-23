import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr', 'de', 'it', 'ja', 'zh', 'ko'],
    defaultLocale: 'en',
    localePrefix: 'always',
    // We manage NEXT_LOCALE ourselves in middleware. Letting next-intl
    // also write it from Accept-Language detection caused stale "fr"
    // cookies on /fr/en for browsers with `Accept-Language: fr-FR`.
    localeDetection: false,
});