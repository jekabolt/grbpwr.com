import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const countryCookie = req.cookies.get('NEXT_COUNTRY')?.value?.toLowerCase();

    const match = pathname.match(/^\/([A-Za-z]{2})\/([a-z]{2})(?=\/|$)(.*)$/);
    if (match) {
        const [, countryRaw, locale, rest] = match;
        const country = countryRaw.toLowerCase();

        // Rewrite to /{locale}/{rest} for the app/router and next-intl
        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${rest || ''}` || '/';

        const newReq = new NextRequest(url, { headers: req.headers });
        const res = intlMiddleware(newReq);

        // Persist selected country in a cookie for server/client consumption
        res.cookies.set('NEXT_COUNTRY', country, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        return res;
    }

    // If URL is locale-only, redirect to country-first URL
    if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
        const localeOnly = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
        if (localeOnly) {
            const [, locale, rest] = localeOnly;
            // Use stored country cookie or default to 'us' for first-time visitors
            const country = countryCookie || 'us';
            const url = req.nextUrl.clone();
            url.pathname = `/${country}/${locale}${rest || ''}` || '/';
            return NextResponse.redirect(url, { status: 308 });
        }
    }

    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};