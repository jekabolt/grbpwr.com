"use client";

import { useEffect } from "react";
import { useCart } from "./store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

export function useCartCurrencySync() {
  const revalidateCart = useCart((state) => state.revalidateCart);
  const validatedCurrency = useCart((state) => state.validatedCurrency);
  const currentCurrency = useTranslationsStore(
    (state) => state.currentCountry.currencyKey,
  );

  useEffect(() => {
    const targetCurrency = currentCurrency || "EUR";
    if (validatedCurrency !== targetCurrency) {
      revalidateCart(targetCurrency);
    }
  }, [currentCurrency, validatedCurrency, revalidateCart]);
}
