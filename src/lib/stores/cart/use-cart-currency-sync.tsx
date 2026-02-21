"use client";

import { useEffect, useRef } from "react";
import { useCart } from "./store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

export function useCartCurrencySync() {
  const revalidateCart = useCart((state) => state.revalidateCart);
  const currentCurrency = useTranslationsStore(
    (state) => state.currentCountry.currencyKey
  );
  const prevCurrencyRef = useRef<string | undefined>(currentCurrency);

  useEffect(() => {
    const prevCurrency = prevCurrencyRef.current;
    const newCurrency = currentCurrency || "EUR";

    if (prevCurrency && prevCurrency !== newCurrency) {
      revalidateCart(newCurrency);
    }

    prevCurrencyRef.current = newCurrency;
  }, [currentCurrency, revalidateCart]);
}
