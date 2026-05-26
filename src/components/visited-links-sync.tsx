"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { markVisited } from "@/lib/visited-links";

export function VisitedLinksSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/product/")) {
      markVisited(pathname);
    }
  }, [pathname]);

  return null;
}
