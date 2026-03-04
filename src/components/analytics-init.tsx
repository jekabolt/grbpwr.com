"use client";

import { useEffect } from "react";

import { defaultCookiePreferences } from "@/components/ui/cookie-banner";
import { captureCampaignOnLoad } from "@/lib/analitycs/campaign";
import { initExceptionTracking } from "@/lib/analitycs/exceptions";
import { initScrollDepthTracking } from "@/lib/analitycs/scroll-depth";
import { ensureGtag } from "@/lib/analitycs/utils";
import { initWebVitals } from "@/lib/analitycs/web-vitals";

function applyStoredConsent() {
  try {
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) return;
    const prefs = JSON.parse(stored) as typeof defaultCookiePreferences;
    ensureGtag();
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: prefs.statistical ? "granted" : "denied",
      ad_storage: prefs.advertising_social_media ? "granted" : "denied",
      ad_user_data: prefs.advertising_social_media ? "granted" : "denied",
      ad_personalization: prefs.advertising_social_media ? "granted" : "denied",
    });
  } catch {
    // ignore
  }
}

export function AnalyticsInit() {
  useEffect(() => {
    applyStoredConsent();
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
