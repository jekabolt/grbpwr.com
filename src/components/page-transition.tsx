"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Plain wrapper (no motion transform): transformed ancestors break
  // `position: fixed` (e.g. checkout CTA + `AdditionalHeader`) on mobile Safari.
  return <div key={pathname}>{children}</div>;
}
