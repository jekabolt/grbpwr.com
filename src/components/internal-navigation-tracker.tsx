"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  syncNavigationOnEntry,
  trackNavigationChange,
} from "@/lib/navigation/internal-navigation";

export function InternalNavigationTracker() {
  const pathname = usePathname();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      syncNavigationOnEntry(pathname);
      return;
    }

    trackNavigationChange(pathname);
  }, [pathname]);

  return null;
}
