"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const DARK_THEME_PATH = /\/timeline(\/|$)/;

export function HtmlThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    const isDark = DARK_THEME_PATH.test(pathname ?? "");
    document.documentElement.classList.toggle("blackTheme", isDark);
  }, [pathname]);

  return null;
}
