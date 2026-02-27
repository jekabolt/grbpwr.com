"use client";

import { useEffect } from "react";

import { initExceptionTracking } from "@/lib/analitycs/exceptions";
import { initWebVitals } from "@/lib/analitycs/web-vitals";

export function AnalyticsInit() {
  useEffect(() => {
    const cleanupExceptions = initExceptionTracking();
    initWebVitals();
    
    return () => {
      cleanupExceptions();
    };
  }, []);

  return null;
}
