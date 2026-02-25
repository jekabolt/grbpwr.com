import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { clearSuggestCookies, getLocaleFromCountry, getNormalizedCountry, handleGeoAction, parseCountryLocalePath, setMainCookies, setSuggestedCookies, supportedCountries } from "./lib/middleware-utils";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permanent redirect www → non-www (308)
    const host = req.headers.get("host") || req.nextUrl.host;
    if (host?.startsWith("www.")) {
        const url = req.nextUrl.clone();
        url.host = host.replace(/^www\./, "");
        return NextResponse.redirect(url, { status: 308 });
    }

    // get existing cookies
    const countryCookie = req.cookies.get("NEXT_COUNTRY")?.value;
    const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;

    //define detected country
    const detectedCountry = process.env.NODE_ENV === "development"
        ? "de"
        : req.headers.get("x-vercel-ip-country") || "us";

    //handle geo actions
    const geoResponse = handleGeoAction(req);
    if (geoResponse) return geoResponse;

    //handle country/locale paths
    const parsedPath = parseCountryLocalePath(pathname);
    if (parsedPath) {
        const { country, locale, rest } = parsedPath;

        // Redirect to home when site is disabled and user navigates to non-home URL
        if (rest?.trim()) {
            try {
                const siteStatusUrl = new URL("/api/site-status", req.url);
                const res = await fetch(siteStatusUrl);
                const { siteEnabled } = (await res.json()) as { siteEnabled?: boolean };
                if (siteEnabled === false) {
                    const url = req.nextUrl.clone();
                    url.pathname = `/${country}/${locale}`;
                    return NextResponse.redirect(url, { status: 307 });
                }
            } catch {
                // Allow through on fetch error
            }
        }

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

        //suggest cookies control - only for new users (no cookies)
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
        const targetCountry = (countryCookie && supportedCountries.includes(countryCookie))
            ? countryCookie
            : getNormalizedCountry(detectedCountry);

        const targetLocale = localeCookie || getLocaleFromCountry(targetCountry);

        // Redirect to home when site is disabled (path is not just / or /locale)
        const isHomePath = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);
        if (!isHomePath) {
            try {
                const siteStatusUrl = new URL("/api/site-status", req.url);
                const siteRes = await fetch(siteStatusUrl);
                const { siteEnabled } = (await siteRes.json()) as { siteEnabled?: boolean };
                if (siteEnabled === false) {
                    const url = req.nextUrl.clone();
                    url.pathname = `/${targetCountry}/${targetLocale}`;
                    const res = NextResponse.redirect(url, { status: 307 });
                    setMainCookies(res, targetCountry, targetLocale);
                    clearSuggestCookies(res);
                    return res;
                }
            } catch {
                // Allow through on fetch error
            }
        }

        // redirect to country/locale
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
