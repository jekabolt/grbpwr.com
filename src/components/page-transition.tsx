"use client";

import * as React from "react";
import { ComponentType, ReactNode, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

// React's experimental ViewTransition is present at runtime but not yet in the
// installed @types/react — access it through a cast.
const ViewTransition = (
  React as unknown as {
    unstable_ViewTransition: ComponentType<{ children?: ReactNode }>;
  }
).unstable_ViewTransition;

// Wraps route content in ViewTransition so the browser cross-fades the old and
// new page (View Transitions API) instead of the old key-remount fade, which
// flashed/jumped. Browsers without support fall back to instant navigation.
// Cross-fade timing is tuned in globals.css.
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <ViewTransition>{children}</ViewTransition>;
}
