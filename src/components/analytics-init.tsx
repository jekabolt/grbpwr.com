"use client";

import { useEffect } from "react";

import { captureCampaignOnLoad } from "@/lib/analitycs/campaign";
import { initExceptionTracking } from "@/lib/analitycs/exceptions";
import { initScrollDepthTracking } from "@/lib/analitycs/scroll-depth";
import { initWebVitals } from "@/lib/analitycs/web-vitals";

export function AnalyticsInit() {
  useEffect(() => {
    captureCampaignOnLoad();
    const cleanupExceptions = initExceptionTracking();
    const cleanupScrollDepth = initScrollDepthTracking();
    initWebVitals();

    return () => {
      cleanupExceptions();
      cleanupScrollDepth();
    };
  }, []);

  return null;
}
