import type { CountryOption } from "@/constants";

const COUNTRY_LOCALE_PREFIX =
  /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/;

export function getPathWithoutCountryLocale(pathname: string): string {
  return pathname.replace(COUNTRY_LOCALE_PREFIX, "") || "/";
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
 * Checkout shipping country change: updates storefront country in zustand, then
 * full navigation with `from_picker=1` so middleware sets `NEXT_COUNTRY` / `NEXT_LOCALE`.
 * @see useAddressFields (shipping branch)
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

  const newLocale = country.lng;
  const pathWithoutLocaleCountry = getPathWithoutCountryLocale(deps.pathname);
  const newPath = `/${country.countryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
  const url = new URL(newPath, window.location.origin);
  url.searchParams.set("from_picker", "1");
  for (const [key, value] of Object.entries(deps.extraSearchParams ?? {})) {
    url.searchParams.set(key, value);
  }
  window.location.href = url.toString();
}
