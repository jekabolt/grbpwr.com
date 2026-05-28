"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export const CHECKOUT_GUEST_SESSION_KEY = "grbpwr.checkout.guestCheckout";
export const CHECKOUT_GUEST_COOKIE = "grbpwr.checkout.guest";
export const CHECKOUT_UNLOAD_RELOAD_KEY = "grbpwr.checkout.unloadReload";

let pendingClearTimeout: ReturnType<typeof setTimeout> | null = null;

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

export function useCheckoutGuestPersistence(initialGuestCheckout = false) {
  const [guestCheckout, setGuestCheckoutState] = useState(() =>
    resolveGuestCheckoutState(initialGuestCheckout),
  );

  useLayoutEffect(() => {
    const resolved = resolveGuestCheckoutState(initialGuestCheckout);
    if (resolved) {
      persistGuestCheckout(true);
      setGuestCheckoutState(true);
    }

    try {
      sessionStorage.removeItem(CHECKOUT_UNLOAD_RELOAD_KEY);
    } catch {
      /* ignore */
    }
  }, [initialGuestCheckout]);

  useEffect(() => {
    if (pendingClearTimeout) {
      clearTimeout(pendingClearTimeout);
      pendingClearTimeout = null;
    }

    const markReload = () => {
      try {
        sessionStorage.setItem(CHECKOUT_UNLOAD_RELOAD_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("beforeunload", markReload);

    return () => {
      window.removeEventListener("beforeunload", markReload);
      pendingClearTimeout = setTimeout(() => {
        pendingClearTimeout = null;
        try {
          const isReload =
            sessionStorage.getItem(CHECKOUT_UNLOAD_RELOAD_KEY) === "1";
          sessionStorage.removeItem(CHECKOUT_UNLOAD_RELOAD_KEY);
          if (!isReload) {
            persistGuestCheckout(false);
          }
        } catch {
          /* ignore */
        }
      }, 0);
    };
  }, []);

  const setGuestCheckout = useCallback((value: boolean) => {
    setGuestCheckoutState(value);
    persistGuestCheckout(value);
  }, []);

  return { guestCheckout, setGuestCheckout };
}
