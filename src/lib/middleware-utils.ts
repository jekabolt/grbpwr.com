import { COUNTRIES_BY_REGION } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

const createCountryToLocaleMap = () => {
    const mapping: Record<string, string> = {};

    Object.entries(COUNTRIES_BY_REGION).forEach(([, countries]) => {
        countries.forEach((country) => {
            mapping[country.countryCode] = country.lng;
        });
    });

    return mapping;
};

export const countryToLocaleMap = createCountryToLocaleMap();
export const supportedCountries = Object.keys(countryToLocaleMap);

export const getLocaleFromCountry = (country: string): string => {
    return countryToLocaleMap[country] || "en";
};

export const getNormalizedCountry = (detectedCountry: string): string => {
    const countryCode = detectedCountry;
    return supportedCountries.includes(countryCode) ? countryCode : "us";
};

const getCookieOptions = (maxAge: number) => {
    return {
        path: "/",
        maxAge,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
    };
};

export const PERSISTENT_COOKIE_OPTIONS = getCookieOptions(60 * 60 * 24 * 365);
export const SUGGEST_COOKIE_OPTIONS = getCookieOptions(60 * 30);
export const CLEAR_COOKIE_OPTIONS = getCookieOptions(0);

export const clearSuggestCookies = (res: NextResponse) => {
    const suggestCookies = [
        "NEXT_SUGGEST_COUNTRY",
        "NEXT_SUGGEST_LOCALE",
        "NEXT_SUGGEST_CURRENT_COUNTRY",
    ];
    suggestCookies.forEach((name) => {
        res.cookies.set(name, "", CLEAR_COOKIE_OPTIONS);
    });
};

export const setSuggestedCookies = (
    res: NextResponse,
    geoCountry: string,
    geoLocale: string,
    currentCountry: string,
) => {
    res.cookies.set("NEXT_SUGGEST_COUNTRY", geoCountry, SUGGEST_COOKIE_OPTIONS);
    res.cookies.set("NEXT_SUGGEST_LOCALE", geoLocale, SUGGEST_COOKIE_OPTIONS);
    res.cookies.set(
        "NEXT_SUGGEST_CURRENT_COUNTRY",
        currentCountry,
        SUGGEST_COOKIE_OPTIONS,
    );
};

export const setMainCookies = (
    res: NextResponse,
    country: string,
    locale: string,
) => {
    res.cookies.set("NEXT_COUNTRY", country, PERSISTENT_COOKIE_OPTIONS);
    res.cookies.set("NEXT_LOCALE", locale, PERSISTENT_COOKIE_OPTIONS);
};

export const handleGeoAction = (req: NextRequest): NextResponse | null => {
    const action = req.nextUrl.searchParams.get("geo");
    if (action !== "dismiss" && action !== "accept") return null;

    const url = req.nextUrl.clone();
    url.searchParams.delete("geo");
    const res = NextResponse.redirect(url, { status: 307 });

    if (action === "dismiss") {
        clearSuggestCookies(res);
        return res;
    }

    const suggestCountry = req.cookies.get("NEXT_SUGGEST_COUNTRY")?.value;
    const suggestLocale = req.cookies.get("NEXT_SUGGEST_LOCALE")?.value;

    if (suggestCountry && suggestLocale) {
        setMainCookies(res, suggestCountry, suggestLocale);

        const target = req.nextUrl.clone();
        target.searchParams.delete("geo");
        target.pathname = `/${suggestCountry}/${suggestLocale}`;
        const acceptRes = NextResponse.redirect(target, { status: 308 });
        clearSuggestCookies(acceptRes);
        return acceptRes;
    }

    clearSuggestCookies(res);
    return res;
};

export interface ParsedPath {
    country?: string;
    locale?: string;
    rest?: string;
}

export const parseCountryLocalePath = (pathname: string): ParsedPath | null => {
    const match = pathname.match(/^\/([A-Za-z]{2})\/([a-z]{2})(?=\/|$)(.*)$/);
    if (!match) return null;

    const [, countryRaw, locale, rest] = match;
    return {
        country: countryRaw,
        locale,
        rest: rest || "",
    };
};

export const parseLocaleOnlyPath = (
    pathname: string,
): { locale: string; rest: string } | null => {
    const match = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
    if (!match) return null;

    const [, locale, rest] = match;
    return { locale, rest: rest || "" };
};
