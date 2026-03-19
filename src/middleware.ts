import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { clearSuggestCookies, getLocaleFromCountry, getNormalizedCountry, handleFromPickerAction, handleGeoAction, parseCountryLocalePath, parseLocaleOnlyPath, setMainCookies, setSuggestedCookies, supportedCountries } from "./lib/middleware-utils";

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

    //handle country picker / update-location redirects (legitimate country switch)
    const fromPickerResponse = handleFromPickerAction(req);
    if (fromPickerResponse) return fromPickerResponse;

    //handle country/locale paths
    const parsedPath = parseCountryLocalePath(pathname);
    if (parsedPath) {
        const { country, locale, rest } = parsedPath;

        // Redirect to home when site is disabled and user navigates to non-home, non-timeline URL
        const isTimelinePath = rest === "/timeline" || rest?.startsWith("/timeline/");
        if (rest?.trim() && !isTimelinePath) {
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

        // Block manual URL country/locale changes – only Country Picker or geo banner may change them
        const allowedCountry = (countryCookie && supportedCountries.includes(countryCookie))
            ? countryCookie
            : getNormalizedCountry(detectedCountry);
        const allowedLocale = (localeCookie && (routing.locales as readonly string[]).includes(localeCookie))
            ? localeCookie
            : getLocaleFromCountry(allowedCountry);
        if (country !== allowedCountry || locale !== allowedLocale) {
            const url = req.nextUrl.clone();
            url.pathname = `/${allowedCountry}/${allowedLocale}${rest}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${rest}` || "/";

        // suggest cookies control - only for new users (no cookies)
        const hadCountry = Boolean(countryCookie);
        const hadLocale = Boolean(localeCookie);
        let geoCountry = "";
        let geoLocale = "";
        let shouldSuggest = false;

        if (!hadCountry || !hadLocale) {
            geoCountry = getNormalizedCountry(detectedCountry);
            geoLocale = getLocaleFromCountry(geoCountry);
            shouldSuggest = geoCountry !== country || geoLocale !== locale;
        }

        const newReq = new NextRequest(url, { headers: req.headers });
        const intlRes = intlMiddleware(newReq);

        const reqHeaders = new Headers(req.headers);
        reqHeaders.set("x-nextjs-country", country!);
        reqHeaders.set("x-nextjs-locale", locale!);
        if (shouldSuggest) {
            reqHeaders.set("x-geo-suggest-country", geoCountry);
            reqHeaders.set("x-geo-suggest-locale", geoLocale);
            reqHeaders.set("x-geo-suggest-current", country!);
        }

        const rewriteUrl = new URL(url.pathname + url.search, req.url);
        const res = NextResponse.rewrite(rewriteUrl, {
            request: { headers: reqHeaders },
        });
        intlRes.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value));
        setMainCookies(res, country!, locale!);
        if (shouldSuggest) {
            setSuggestedCookies(res, geoCountry, geoLocale, country!);
        } else {
            clearSuggestCookies(res);
        }
        return res;
    }

    //handle paths without country/locale (e.g. /, /en, /en/products)
    if (!/^\/[A-Za-z]{2}\/[a-z]{2}(?=\/|$)/.test(pathname)) {
        const targetCountry = (countryCookie && supportedCountries.includes(countryCookie))
            ? countryCookie
            : getNormalizedCountry(detectedCountry);

        const localeOnly = parseLocaleOnlyPath(pathname);
        const targetLocale = localeOnly
            ? ((routing.locales as readonly string[]).includes(localeOnly.locale) ? localeOnly.locale : localeCookie || getLocaleFromCountry(targetCountry))
            : localeCookie || getLocaleFromCountry(targetCountry);
        const pathRest = pathname === "/" ? "" : (localeOnly?.rest ?? pathname);

        // Redirect to home when site is disabled (path is not just /, /locale, or timeline)
        const isHomePath = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);
        const isTimelinePath = /\/timeline(\/|$)/.test(pathname);
        if (!isHomePath && !isTimelinePath) {
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

        // redirect to country/locale (preserve path when locale-only e.g. /en/products -> /us/en/products)
        const url = req.nextUrl.clone();
        url.pathname = `/${targetCountry}/${targetLocale}${pathRest}`;
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
