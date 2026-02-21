"use client";

import type { ReactNode } from "react";
import { useCartCurrencySync } from "./use-cart-currency-sync";

export function CartCurrencySyncWrapper({ children }: { children: ReactNode }) {
  useCartCurrencySync();
  return <>{children}</>;
}
