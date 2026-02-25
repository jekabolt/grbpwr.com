"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useDataContext } from "../contexts/DataContext";

function isHomePath(pathname: string | null): boolean {
  if (!pathname || pathname === "/") return true;
  if (/^\/[a-z]{2}\/?$/.test(pathname)) return true;
  if (/^\/[A-Za-z]{2}\/[a-z]{2}\/?$/.test(pathname)) return true;
  return false;
}

function isTimelinePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /\/timeline(\/|$)/.test(pathname);
}

export function SiteGuard({ children }: { children: React.ReactNode }) {
  const { dictionary } = useDataContext();
  const pathname = usePathname();
  const router = useRouter();
  const isWebsiteEnabled = dictionary?.siteEnabled;

  useEffect(() => {
    if (isWebsiteEnabled !== false) return;
    if (isHomePath(pathname) || isTimelinePath(pathname)) return;

    const homePath =
      pathname?.match(/^(\/[A-Za-z]{2}\/[a-z]{2}|\/[a-z]{2})/)?.[1] || "/en";
    router.replace(homePath);
  }, [isWebsiteEnabled, pathname, router]);

  return <>{children}</>;
}
