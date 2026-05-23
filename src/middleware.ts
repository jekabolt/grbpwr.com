import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { clearSuggestCookies, getLocaleFromCountry, getNormalizedCountry, handleFromPickerAction, handleGeoAction, isAllowedWhenSiteDisabled, parseCountryLocalePath, parseLocaleOnlyPath, setMainCookies, setSuggestedCookies, supportedCountries } from "./lib/middleware-utils";

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
        ? "gb"
        : req.headers.get("x-vercel-ip-country") || "gb";

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

        // Redirect to home when site is disabled and URL is not timeline / footer-help allowlist
        if (rest?.trim() && !isAllowedWhenSiteDisabled(pathname)) {
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
            url.pathname = `/gb/en${rest}`;
            return NextResponse.redirect(url, { status: 308 });
        }

        // URL is the source of truth: when /{country}/{locale} is a valid combo,
        // trust it and let setMainCookies (below) sync cookies to match. The previous
        // "block manual URL changes" guard caused legitimate refreshes of /fr/en to
        // revert to /fr/{cookieLocale} when the cookie hadn't caught up yet.
        // 307 (not 308) because the resolved locale can change with cookies.
        if (!(routing.locales as readonly string[]).includes(locale!)) {
            const fallbackLocale = getLocaleFromCountry(country!);
            const url = req.nextUrl.clone();
            url.pathname = `/${country}/${fallbackLocale}${rest}`;
            return NextResponse.redirect(url, { status: 307 });
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
        // Still run intlMiddleware so next-intl picks up the rewritten URL for
        // translations, but discard its response — we manage cookies ourselves.
        intlMiddleware(newReq);

        const reqHeaders = new Headers(req.headers);
        reqHeaders.set("x-nextjs-country", country!);
        reqHeaders.set("x-nextjs-locale", locale!);
        // Override the request's Cookie header so RSC/server components see the
        // URL-derived values immediately, even if the browser still holds a stale
        // NEXT_LOCALE from before. Without this, getInitialTranslationState reads
        // the old cookie and initializes the store with the wrong language.
        const existingCookies = req.headers.get("cookie") ?? "";
        const cookiesWithoutLocale = existingCookies
            .split(/;\s*/)
            .filter((c) => c && !/^NEXT_(LOCALE|COUNTRY)=/.test(c))
            .join("; ");
        reqHeaders.set(
            "cookie",
            [cookiesWithoutLocale, `NEXT_COUNTRY=${country}`, `NEXT_LOCALE=${locale}`]
                .filter(Boolean)
                .join("; "),
        );
        if (shouldSuggest) {
            reqHeaders.set("x-geo-suggest-country", geoCountry);
            reqHeaders.set("x-geo-suggest-locale", geoLocale);
            reqHeaders.set("x-geo-suggest-current", country!);
        }

        const rewriteUrl = new URL(url.pathname + url.search, req.url);
        const res = NextResponse.rewrite(rewriteUrl, {
            request: { headers: reqHeaders },
        });
        // Prevent any edge/CDN caching of this rewrite — we depend on the
        // Set-Cookie below being applied on every request.
        res.headers.set("Cache-Control", "no-store");
        setMainCookies(res, country!, locale!);
        const suggestCountryCookie = req.cookies.get("NEXT_SUGGEST_COUNTRY")?.value;
        const suggestLocaleCookie = req.cookies.get("NEXT_SUGGEST_LOCALE")?.value;
        const suggestCurrentCookie = req.cookies.get("NEXT_SUGGEST_CURRENT_COUNTRY")?.value;

        if (shouldSuggest) {
            setSuggestedCookies(res, geoCountry, geoLocale, country!);
        } else if (suggestCountryCookie && suggestLocaleCookie && suggestCurrentCookie) {
            const pathCountry = country!;
            const pathLocale = locale!;
            const onSuggestedNow =
                suggestCountryCookie.toLowerCase() === pathCountry.toLowerCase() &&
                suggestLocaleCookie === pathLocale;
            const issuedForThisCountry =
                suggestCurrentCookie.toLowerCase() === pathCountry.toLowerCase();

            if (onSuggestedNow) {
                clearSuggestCookies(res);
            } else if (issuedForThisCountry) {
                setSuggestedCookies(
                    res,
                    suggestCountryCookie,
                    suggestLocaleCookie,
                    suggestCurrentCookie,
                );
            } else {
                clearSuggestCookies(res);
            }
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

        // Redirect to home when site is disabled (path is not home, timeline, or footer/help allowlist)
        const isHomePath = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);
        if (!isHomePath && !isAllowedWhenSiteDisabled(pathname)) {
            try {
                const siteStatusUrl = new URL("/api/site-status", req.url);
                const siteRes = await fetch(siteStatusUrl);
                const { siteEnabled } = (await siteRes.json()) as { siteEnabled?: boolean };
                if (siteEnabled === false) {
                    const url = req.nextUrl.clone();
                    url.pathname = `/${targetCountry}/${targetLocale}`;
                    const res = NextResponse.redirect(url, { status: 307 });
                    setMainCookies(res, targetCountry, targetLocale);
                    return res;
                }
            } catch {
                // Allow through on fetch error
            }
        }

        // redirect to country/locale (preserve path when locale-only e.g. /en/products -> /us/en/products)
        // 307 + no-store so browsers/CDNs never cache /account -> /fr/fr/account when cookies later flip to en.
        const url = req.nextUrl.clone();
        url.pathname = `/${targetCountry}/${targetLocale}${pathRest}`;
        const res = NextResponse.redirect(url, { status: 307 });
        res.headers.set("Cache-Control", "no-store");
        // Ensure defaults are persisted for subsequent requests
        setMainCookies(res, targetCountry, targetLocale);
        return res;
    }
    return intlMiddleware(req);
}


export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
