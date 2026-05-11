"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { clearStoredLoginAttempt } from "@/app/[locale]/account/utils/use-account-login";

function isAccountPath(pathname: string): boolean {
  return /\/account\/?$/.test(pathname);
}

export function AccountLoginAttemptRouteSync() {
  const pathname = usePathname() ?? "";
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    if (prev != null && isAccountPath(prev) && !isAccountPath(pathname)) {
      clearStoredLoginAttempt();
    }
  }, [pathname]);

  return null;
}
