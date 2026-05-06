"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { clearGuestCheckoutIntent } from "@/lib/checkout/guest-checkout-intent";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";

function pathIsCheckoutRoute(pathname: string): boolean {
  return pathname.split("/").filter(Boolean).includes("checkout");
}

export function GuestCheckoutIntentPathSync() {
  const pathname = usePathname() ?? "";
  const isSignedIn = useAccountOnboardingStore((s) => s.isSignedIn);
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathRef.current;
    if (
      prev !== null &&
      pathIsCheckoutRoute(prev) &&
      !pathIsCheckoutRoute(pathname) &&
      !isSignedIn
    ) {
      clearGuestCheckoutIntent();
    }
    prevPathRef.current = pathname;
  }, [pathname, isSignedIn]);

  return null;
}
