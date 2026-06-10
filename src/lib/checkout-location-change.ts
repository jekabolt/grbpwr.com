export const CHECKOUT_LOCATION_CHANGE_CANCELLED =
  "checkout:location-change-cancelled";

const CHECKOUT_LOCALE_SWITCH_ACCEPTED_KEY =
  "grbpwr.checkout.localeSwitchAccepted";

type AcceptedLocaleSwitch = {
  addressId: number;
  countryCode: string;
};

function normalizeCountryCode(countryCode?: string) {
  return countryCode?.trim().toLowerCase() ?? "";
}

export function notifyCheckoutLocationChangeCancelled() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHECKOUT_LOCATION_CHANGE_CANCELLED));
}

export function markCheckoutLocaleSwitchAccepted(
  addressId: number,
  countryCode: string,
) {
  if (typeof window === "undefined") return;
  if (!Number.isFinite(addressId) || addressId < 0) return;
  const code = normalizeCountryCode(countryCode);
  if (!code) return;

  sessionStorage.setItem(
    CHECKOUT_LOCALE_SWITCH_ACCEPTED_KEY,
    JSON.stringify({ addressId, countryCode: code }),
  );
}

export function readCheckoutLocaleSwitchAccepted(): AcceptedLocaleSwitch | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHECKOUT_LOCALE_SWITCH_ACCEPTED_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AcceptedLocaleSwitch>;
    const addressId = Number(parsed.addressId);
    const countryCode = normalizeCountryCode(parsed.countryCode);

    if (!Number.isFinite(addressId) || addressId < 0 || !countryCode) {
      return null;
    }

    return { addressId, countryCode };
  } catch {
    return null;
  }
}

export function clearCheckoutLocaleSwitchAccepted() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_LOCALE_SWITCH_ACCEPTED_KEY);
}

export function isCheckoutLocaleSwitchAcceptedForAddress(
  addressId: number,
  addressCountry?: string,
): boolean {
  const accepted = readCheckoutLocaleSwitchAccepted();
  if (!accepted) return false;

  return (
    accepted.addressId === addressId &&
    accepted.countryCode === normalizeCountryCode(addressCountry)
  );
}

export function isCheckoutLocaleSwitchPendingNavigation(
  storeCountryCode?: string,
  urlCountryCode?: string,
): boolean {
  const accepted = readCheckoutLocaleSwitchAccepted();
  if (!accepted) return false;

  const storeCountry = normalizeCountryCode(storeCountryCode);
  const urlCountry = normalizeCountryCode(urlCountryCode);

  return storeCountry === accepted.countryCode && urlCountry !== accepted.countryCode;
}
