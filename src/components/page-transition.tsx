"use client";

import { ReactNode, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // `key={pathname}` remounts the wrapper on each navigation, which re-runs the
  // CSS fade-in. Replaces framer-motion's AnimatePresence to keep it out of the
  // shared bundle (loaded on every route).
  return (
    <div key={pathname} className="min-h-0 w-full animate-page-fade-in">
      {children}
    </div>
  );
}
