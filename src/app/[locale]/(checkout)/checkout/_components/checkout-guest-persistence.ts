export const CHECKOUT_GUEST_SESSION_KEY = "grbpwr.checkout.guestCheckout";
export const CHECKOUT_GUEST_COOKIE = "grbpwr.checkout.guest";
export const CHECKOUT_UNLOAD_RELOAD_KEY = "grbpwr.checkout.unloadReload";

export function isGuestCheckoutCookie(value: string | undefined): boolean {
  return value === "1";
}

export function readGuestCheckoutSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(CHECKOUT_GUEST_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function writeGuestCheckoutCookie(value: boolean): void {
  if (typeof window === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  try {
    if (value) {
      document.cookie = `${CHECKOUT_GUEST_COOKIE}=1; path=/; SameSite=Lax${secure}`;
    } else {
      document.cookie = `${CHECKOUT_GUEST_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    }
  } catch {
    /* ignore */
  }
}

export function persistGuestCheckout(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(CHECKOUT_GUEST_SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(CHECKOUT_GUEST_SESSION_KEY);
    }
  } catch {
    /* ignore */
  }

  writeGuestCheckoutCookie(value);
}

export function clearGuestCheckoutPersistence(): void {
  persistGuestCheckout(false);
}

export function resolveGuestCheckoutState(
  initialGuestCheckout: boolean,
): boolean {
  return initialGuestCheckout || readGuestCheckoutSession();
}
