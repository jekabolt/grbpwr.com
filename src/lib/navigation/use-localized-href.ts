"use client";

import { usePathname } from "next/navigation";

const COUNTRY_LOCALE_PREFIX = /^(\/[A-Za-z]{2}\/[a-z]{2})(?=\/|$)/;

/**
 * Resolves an internal href against the current `/{country}/{locale}` URL prefix
 * so bare paths like "/account" become "/fr/en/account" — bypassing the middleware
 * redirect chain (which can be served from a stale browser cache when the cookie
 * is older than the URL).
 */
export function useLocalizedHref(): (href: string) => string {
  const pathname = usePathname() || "";
  const match = pathname.match(COUNTRY_LOCALE_PREFIX);
  const prefix = match?.[1] ?? "";
  return (href: string) => {
    if (!prefix) return href;
    if (!href.startsWith("/")) return href;
    if (href.startsWith(prefix + "/") || href === prefix) return href;
    return `${prefix}${href === "/" ? "" : href}`;
  };
}
