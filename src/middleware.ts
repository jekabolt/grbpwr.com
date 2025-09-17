import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { isValidCountryLocale, routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if pathname matches country/locale pattern (e.g., /fr/en/...)
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
        const [firstSegment, secondSegment] = pathSegments;

        // Check if this is a valid country/locale combination
        if (isValidCountryLocale(firstSegment, secondSegment)) {
            // Valid country/locale combination
            // Create new URL with just the locale prefix (remove country)
            const remainingPath = pathSegments.slice(2).join('/');
            const newPathname = remainingPath ? `/${secondSegment}/${remainingPath}` : `/${secondSegment}`;
            const newUrl = new URL(newPathname, request.url);

            console.log(`Middleware: ${pathname} -> ${newPathname} (country: ${firstSegment}, locale: ${secondSegment})`);

            // Create a new request with the rewritten URL
            const newRequest = new NextRequest(newUrl, request);

            // Add country to headers for use in components
            const response = NextResponse.rewrite(newUrl);
            response.headers.set('x-country', firstSegment);
            response.headers.set('x-locale', secondSegment);

            return response;
        }
    }

    // Fallback to default next-intl middleware
    console.log(`Middleware: Using default next-intl for ${pathname}`);
    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};