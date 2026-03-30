"use client";

import { useEffect } from "react";

import { defaultCookiePreferences } from "@/components/ui/cookie-banner";
import { captureCampaignOnLoad } from "@/lib/analitycs/campaign";
import { initExceptionTracking } from "@/lib/analitycs/exceptions";
import { initTimeOnPageTracking } from "@/lib/analitycs/time-on-page";
import { ensureGtag, refreshGa4ClientIdToStorage } from "@/lib/analitycs/utils";
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

function scheduleGa4ClientIdWarmup(): () => void {
  if (typeof window === "undefined") return () => {};
  refreshGa4ClientIdToStorage();
  const delaysMs = [300, 1000, 2500, 5000];
  const timers = delaysMs.map((ms) =>
    window.setTimeout(() => refreshGa4ClientIdToStorage(), ms),
  );
  const onConsent = () => {
    refreshGa4ClientIdToStorage();
    window.setTimeout(refreshGa4ClientIdToStorage, 200);
    window.setTimeout(refreshGa4ClientIdToStorage, 1500);
  };
  window.addEventListener("cookie-consent-accepted", onConsent);
  return () => {
    timers.forEach(clearTimeout);
    window.removeEventListener("cookie-consent-accepted", onConsent);
  };
}

export function AnalyticsInit() {
  useEffect(() => {
    applyStoredConsent();
    captureCampaignOnLoad();
    const cleanupGa4ClientId = scheduleGa4ClientIdWarmup();
    const cleanupExceptions = initExceptionTracking();
    const cleanupTimeOnPage = initTimeOnPageTracking();
    initWebVitals();

    return () => {
      cleanupGa4ClientId();
      cleanupExceptions();
      cleanupTimeOnPage();
    };
  }, []);

  return null;
}
