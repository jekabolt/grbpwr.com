import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { clearSuggestCookies, getLocaleFromCountry, getNormalizedCountry, handleGeoAction, parseCountryLocalePath, setMainCookies, setSuggestedCookies, supportedCountries } from "./lib/middleware-utils";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // get existing cookies
    const countryCookie = req.cookies.get("NEXT_COUNTRY")?.value;
    const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;

    //define detected country
    const detectedCountry = process.env.NODE_ENV === "development"
        ? "us"
        : req.headers.get("x-vercel-ip-country") || "us";

    //handle geo actions
    const geoResponse = handleGeoAction(req);
    if (geoResponse) return geoResponse;

    //handle country/locale paths
    const parsedPath = parseCountryLocalePath(pathname);
    if (parsedPath) {
        const { country, locale, rest } = parsedPath;

        if (!supportedCountries.includes(country!)) {
            const url = req.nextUrl.clone();
            url.pathname = `/us/en${rest}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${rest}` || "/";
        const newReq = new NextRequest(url, { headers: req.headers });
        const res = intlMiddleware(newReq);

        // persist only country; let next-intl own NEXT_LOCALE
        setMainCookies(res, country!, locale!);

        //suggest cookies control
        const hadCountry = Boolean(countryCookie);
        const hadLocale = Boolean(localeCookie);

        if (!hadCountry || !hadLocale) {
            const geoCountry = getNormalizedCountry(detectedCountry);
            const geoLocale = getLocaleFromCountry(geoCountry);
            const differs = geoCountry !== country || geoLocale !== locale;

            if (differs) {
                setSuggestedCookies(res, geoCountry, geoLocale, country!);
            }
        } else {
            clearSuggestCookies(res);
        }
        return res;
    }

    //handle paths without country/locale
    if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
        // redirect to country/locale
        const targetCountry = (countryCookie && supportedCountries.includes(countryCookie))
            ? countryCookie
            : getNormalizedCountry(detectedCountry);

        const targetLocale = localeCookie || getLocaleFromCountry(targetCountry);

        const url = req.nextUrl.clone();
        url.pathname = `/${targetCountry}/${targetLocale}${pathname}`;
        const res = NextResponse.redirect(url, { status: 308 });
        // Ensure defaults are persisted for subsequent requests
        setMainCookies(res, targetCountry, targetLocale);
        clearSuggestCookies(res);
        return res;
    }
    return intlMiddleware(req);
}


export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
