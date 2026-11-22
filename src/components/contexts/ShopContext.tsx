"use client";

import { createContext, ReactNode, useContext } from "react";

import type { ShopLink } from "@/lib/shop/profile";

/** Public brand fields of the shop on this host (no secrets, no ids shown). */
export type ShopBrand = {
  name: string;
  legalName: string;
  logoUrl?: string;
  email?: string;
  address?: string;
  socials: ShopLink[];
  primaryHost: string;
  /** Stripe Connect account for direct charges (`acct_…`), if connected. */
  stripeAccountId?: string;
  /** Team's own publishable key (pasted keys); empty → platform key from env. */
  stripePublishableKey?: string;
  legal?: Record<string, string>;
};

const ShopContext = createContext<ShopBrand>({
  name: "",
  legalName: "",
  socials: [],
  primaryHost: "",
});

export function ShopContextProvider({
  brand,
  children,
}: {
  brand: ShopBrand;
  children: ReactNode;
}) {
  return <ShopContext.Provider value={brand}>{children}</ShopContext.Provider>;
}

export const useShopBrand = () => useContext(ShopContext);
