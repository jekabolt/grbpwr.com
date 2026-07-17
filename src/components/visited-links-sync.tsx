"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { markVisited } from "@/lib/visited-links";

export function VisitedLinksSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/p/")) {
      markVisited(pathname);
    }
  }, [pathname]);

  return null;
}
