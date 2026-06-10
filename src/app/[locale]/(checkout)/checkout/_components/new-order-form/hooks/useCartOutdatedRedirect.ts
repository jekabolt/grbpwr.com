"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

const REDIRECT_DELAY_MS = 2000;

type UseCartOutdatedRedirectOptions = {
  order: ValidateOrderItemsInsertResponse | undefined;
  message: string;
  // Fired once when the cart is detected as outdated: closes the other
  // toasters and shows the single "cart unavailable" toast.
  onOutdated: (message: string) => void;
};

/**
 * When order validation returns zero valid items, the cart is no longer
 * fulfillable (items sold out / removed). We surface a single toast and send
 * the user back to the catalog. Fires at most once per mount.
 */
export function useCartOutdatedRedirect({
  order,
  message,
  onOutdated,
}: UseCartOutdatedRedirectOptions) {
  const router = useRouter();
  const { currentCountry, languageId } = useTranslationsStore((state) => state);
  const handledRef = useRef(false);

  // Keep the latest values in a ref so the effect can depend solely on the
  // outdated flag — otherwise unstable callbacks would re-run the effect and
  // its cleanup would cancel the pending redirect timeout.
  const latestRef = useRef({ message, onOutdated, router, currentCountry, languageId });
  latestRef.current = { message, onOutdated, router, currentCountry, languageId };

  const cartOutdated = !!order?.validItems && order.validItems.length === 0;

  useEffect(() => {
    if (!cartOutdated || handledRef.current) return;
    handledRef.current = true;

    const { message, onOutdated, router, currentCountry, languageId } =
      latestRef.current;

    onOutdated(message);

    const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
    const country = currentCountry.countryCode?.toLowerCase() || "gb";
    const timeout = setTimeout(() => {
      router.push(`/${country}/${locale}/catalog`);
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [cartOutdated]);
}
