import type { CountryOption } from "@/constants";

import { parseCountryLocalePath } from "@/lib/middleware-utils";

const COUNTRY_LOCALE_PREFIX =
  /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/;

export function getPathWithoutCountryLocale(pathname: string): string {
  return pathname.replace(COUNTRY_LOCALE_PREFIX, "") || "/";
}

function getPathRest(pathname: string): string {
  const without = getPathWithoutCountryLocale(pathname);
  return without === "/" ? "" : without;
}

function resolveCountryCode(pathname: string, fallback: string): string {
  const parsed = parseCountryLocalePath(pathname);
  return (parsed?.country ?? fallback).toLowerCase();
}

function setMainCookiesClient(country: string, locale: string): void {
  const maxAge = 60 * 60 * 24 * 365;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const base = `path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  document.cookie = `NEXT_COUNTRY=${country.toLowerCase()}; ${base}`;
  document.cookie = `NEXT_LOCALE=${locale}; ${base}`;
}

type NavigateWithPickerOptions = {
  countryCode: string;
  locale: string;
  pathname: string;
  extraSearchParams?: Record<string, string>;
  /** Middleware clears suggest cookies and re-persists country/locale. */
  fromPicker?: boolean;
};

/**
 * Full navigation to `/{country}/{locale}{rest}` with cookies set first so
 * middleware URL lock accepts the change. Never uses locale-only paths (`/de`)
 * which break on home when country code equals locale code.
 */
export function navigateWithPicker({
  countryCode,
  locale,
  pathname,
  extraSearchParams,
  fromPicker,
}: NavigateWithPickerOptions): void {
  const country = countryCode.toLowerCase();
  const rest = getPathRest(pathname);

  setMainCookiesClient(country, locale);

  const url = new URL(`/${country}/${locale}${rest}`, window.location.origin);
  url.search = window.location.search;
  if (fromPicker) {
    url.searchParams.set("from_picker", "1");
  }
  for (const [key, value] of Object.entries(extraSearchParams ?? {})) {
    url.searchParams.set(key, value);
  }
  window.location.assign(url.toString());
}

/** Language-only change; keeps current country from URL or store. */
export function navigateToLocaleWithPicker(
  locale: string,
  pathname: string,
  countryCode: string,
): void {
  navigateWithPicker({
    countryCode: resolveCountryCode(pathname, countryCode),
    locale,
    pathname,
  });
}

type StoreActions = {
  cancelNextCountry: () => void;
  setCurrentCountry: (c: {
    name: string;
    countryCode: string;
    currencyKey?: string;
  }) => void;
};

export type NavigateToCountryWithPickerOptions = {
  pathname: string;
  extraSearchParams?: Record<string, string>;
} & StoreActions;

/**
 * Country change (checkout shipping, account email prefs, etc.):
 * updates zustand, then same full navigation as locale change.
 */
export function navigateToCountryWithPicker(
  country: CountryOption,
  deps: NavigateToCountryWithPickerOptions,
  checkoutStash?: { email: string; promoCode: string } | null,
): void {
  deps.cancelNextCountry();
  deps.setCurrentCountry({
    name: country.name,
    countryCode: country.countryCode,
    currencyKey: country.currencyKey,
  });

  if (checkoutStash && (checkoutStash.email || checkoutStash.promoCode)) {
    sessionStorage.setItem(
      "checkout-country-change-stash",
      JSON.stringify({
        email: checkoutStash.email || "",
        promoCode: checkoutStash.promoCode || "",
      }),
    );
  }

  navigateWithPicker({
    countryCode: country.countryCode,
    locale: country.lng,
    pathname: deps.pathname,
    extraSearchParams: deps.extraSearchParams,
    fromPicker: true,
  });
}
