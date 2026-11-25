"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import {
  CHECKOUT_UNLOAD_RELOAD_KEY,
  persistGuestCheckout,
  resolveGuestCheckoutState,
} from "./checkout-guest-persistence";

let pendingClearTimeout: ReturnType<typeof setTimeout> | null = null;

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
