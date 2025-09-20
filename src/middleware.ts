import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Mapping стран к предпочтительным локалям
const countryToLocaleMap: Record<string, string> = {
    'pl': 'pl',
    'de': 'de',
    'fr': 'fr',
    'it': 'it',
    'us': 'en',
    'cn': 'zh',
    'jp': 'ja',
    'kr': 'ko',
};

const getLocaleFromCountry = (country: string): string => {
    return countryToLocaleMap[country.toLowerCase()] || 'en';
};

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const countryCookie = req.cookies.get('NEXT_COUNTRY')?.value?.toLowerCase();
    const localeCookie = req.cookies.get('NEXT_LOCALE')?.value;

    // Получаем страну из заголовков Vercel
    const detectedCountry = process.env.NODE_ENV === 'development'
        ? 'de'
        : (req.headers.get('x-vercel-ip-country')?.toLowerCase() || 'us');

    const match = pathname.match(/^\/([A-Za-z]{2})\/([a-z]{2})(?=\/|$)(.*)$/);
    if (match) {
        const [, countryRaw, locale, rest] = match;
        const country = countryRaw.toLowerCase();

        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${rest || ''}` || '/';

        const newReq = new NextRequest(url, { headers: req.headers });
        const res = intlMiddleware(newReq);

        res.cookies.set('NEXT_COUNTRY', country, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        res.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        return res;
    }

    if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
        const localeOnly = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
        if (localeOnly) {
            const [, locale, rest] = localeOnly;
            const country = countryCookie || detectedCountry;
            const url = req.nextUrl.clone();
            url.pathname = `/${country}/${locale}${rest || ''}` || '/';
            return NextResponse.redirect(url, { status: 308 });
        }

        const targetCountry = countryCookie || detectedCountry;
        const targetLocale = localeCookie || getLocaleFromCountry(targetCountry);

        const url = req.nextUrl.clone();
        url.pathname = `/${targetCountry}/${targetLocale}${pathname}`;
        return NextResponse.redirect(url, { status: 308 });
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
