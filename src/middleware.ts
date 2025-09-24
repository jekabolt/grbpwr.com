import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { COUNTRIES_BY_REGION } from "./constants";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const createCountryToLocaleMap = () => {
    const mapping: Record<string, string> = {};

    Object.entries(COUNTRIES_BY_REGION).forEach(([region, countries]) => {
        countries.forEach((country) => {
            mapping[country.countryCode.toLowerCase()] = country.lng;
        });
    });

    return mapping;
};

const countryToLocaleMap = createCountryToLocaleMap();
const supportedCountries = Object.keys(countryToLocaleMap);

const getLocaleFromCountry = (country: string): string => {
    return countryToLocaleMap[country.toLowerCase()] || "en";
};

const getNormalizedCountry = (detectedCountry: string): string => {
    const countryCode = detectedCountry.toLowerCase();
    return supportedCountries.includes(countryCode) ? countryCode : "us";
};

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const countryCookie = req.cookies.get("NEXT_COUNTRY")?.value?.toLowerCase();
    const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;

    const detectedCountry =
        process.env.NODE_ENV === "development"
            ? "de"
            : req.headers.get("x-vercel-ip-country")?.toLowerCase() || "us";

    const action = req.nextUrl.searchParams.get("geo");
    if (action === "dismiss" || action === "accept") {
        const url = req.nextUrl.clone();
        url.searchParams.delete("geo");

        const res = NextResponse.redirect(url, { status: 307 });

        const clearSuggestCookies = () => {
            res.cookies.set("NEXT_SUGGEST_COUNTRY", "", { path: "/", maxAge: 0 });
            res.cookies.set("NEXT_SUGGEST_LOCALE", "", { path: "/", maxAge: 0 });
            res.cookies.set("NEXT_SUGGEST_CURRENT_COUNTRY", "", {
                path: "/",
                maxAge: 0,
            });
        };

        if (action === "dismiss") {
            clearSuggestCookies();
            return res;
        }

        const suggestCountry = req.cookies.get("NEXT_SUGGEST_COUNTRY")?.value;
        const suggestLocale = req.cookies.get("NEXT_SUGGEST_LOCALE")?.value;

        if (suggestCountry && suggestLocale) {
            res.cookies.set("NEXT_COUNTRY", suggestCountry, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365,
            });
            res.cookies.set("NEXT_LOCALE", suggestLocale, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365,
            });

            const target = req.nextUrl.clone();
            target.searchParams.delete("geo");
            target.pathname = `/${suggestCountry}/${suggestLocale}`;
            const acceptRes = NextResponse.redirect(target, { status: 308 });
            clearSuggestCookies();
            return acceptRes;
        }

        clearSuggestCookies();
        return res;
    }

    const match = pathname.match(/^\/([A-Za-z]{2})\/([a-z]{2})(?=\/|$)(.*)$/);
    if (match) {
        const [, countryRaw, locale, rest] = match;
        const country = countryRaw.toLowerCase();

        if (!supportedCountries.includes(country)) {
            const url = req.nextUrl.clone();
            url.pathname = `/us/en${rest || ""}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${rest || ""}` || "/";

        const newReq = new NextRequest(url, { headers: req.headers });
        const res = intlMiddleware(newReq);

        const hadCountry = Boolean(countryCookie);
        const hadLocale = Boolean(localeCookie);

        res.cookies.set("NEXT_COUNTRY", country, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });
        res.cookies.set("NEXT_LOCALE", locale, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });

        if (!hadCountry || !hadLocale) {
            const geoCountry = getNormalizedCountry(detectedCountry);
            const geoLocale = getLocaleFromCountry(geoCountry);
            const differs = geoCountry !== country || geoLocale !== locale;
            if (differs) {
                res.cookies.set("NEXT_SUGGEST_COUNTRY", geoCountry, {
                    path: "/",
                    maxAge: 60 * 30,
                });
                res.cookies.set("NEXT_SUGGEST_LOCALE", geoLocale, {
                    path: "/",
                    maxAge: 60 * 30,
                });
                res.cookies.set("NEXT_SUGGEST_CURRENT_COUNTRY", country, {
                    path: "/",
                    maxAge: 60 * 30,
                });
            }
        } else {

            res.cookies.set("NEXT_SUGGEST_COUNTRY", "", { path: "/", maxAge: 0 });
            res.cookies.set("NEXT_SUGGEST_LOCALE", "", { path: "/", maxAge: 0 });
            res.cookies.set("NEXT_SUGGEST_CURRENT_COUNTRY", "", { path: "/", maxAge: 0 });
        }

        return res;
    }

    if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
        const localeOnly = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
        if (localeOnly) {
            const [, locale, rest] = localeOnly;

            let targetCountry = "us";
            if (countryCookie && supportedCountries.includes(countryCookie)) {
                targetCountry = countryCookie;
            } else {
                targetCountry = getNormalizedCountry(detectedCountry);
            }

            const url = req.nextUrl.clone();
            url.pathname = `/${targetCountry}/${locale}${rest || ""}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        let targetCountry = "us";
        let targetLocale = "en";

        if (countryCookie && supportedCountries.includes(countryCookie)) {
            targetCountry = countryCookie;
            targetLocale = localeCookie || getLocaleFromCountry(countryCookie);
        } else {
            targetCountry = getNormalizedCountry(detectedCountry);
            targetLocale = localeCookie || getLocaleFromCountry(targetCountry);
        }

        const url = req.nextUrl.clone();
        url.pathname = `/${targetCountry}/${targetLocale}${pathname}`;
        return NextResponse.redirect(url, { status: 308 });
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
