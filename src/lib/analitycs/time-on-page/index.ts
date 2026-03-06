import { pushCustomEvent } from "../utils";

const TIME_TRACKING_INTERVAL_MS = 15000;
const VISIBILITY_THRESHOLD_MS = 1000;

interface PageTimeData {
  page_path: string;
  visible_time_seconds: number;
  total_time_seconds: number;
  engagement_score: number;
  [key: string]: unknown;
}

let pageStartTime = 0;
let lastVisibleTime = 0;
let totalVisibleTime = 0;
let isVisible = true;
let currentPath = "";
let trackingInterval: NodeJS.Timeout | null = null;

export function initTimeOnPageTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  currentPath = window.location.pathname;
  pageStartTime = Date.now();
  lastVisibleTime = pageStartTime;
  isVisible = !document.hidden;

  const handleVisibilityChange = () => {
    const now = Date.now();
    if (document.hidden) {
      if (isVisible && now - lastVisibleTime >= VISIBILITY_THRESHOLD_MS) {
        totalVisibleTime += now - lastVisibleTime;
      }
      isVisible = false;
    } else {
      isVisible = true;
      lastVisibleTime = now;
    }
  };

  const handlePathChange = () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      sendTimeOnPageEvent();
      resetTracking(newPath);
    }
  };

  const sendPeriodicUpdate = () => {
    if (isVisible) {
      const now = Date.now();
      totalVisibleTime += now - lastVisibleTime;
      lastVisibleTime = now;
    }
    sendTimeOnPageEvent(false);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("popstate", handlePathChange);
  
  trackingInterval = setInterval(sendPeriodicUpdate, TIME_TRACKING_INTERVAL_MS);

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function (...args) {
    originalPushState.apply(window.history, args);
    handlePathChange();
  };

  window.history.replaceState = function (...args) {
    originalReplaceState.apply(window.history, args);
    handlePathChange();
  };

  const handleBeforeUnload = () => {
    sendTimeOnPageEvent(true);
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("popstate", handlePathChange);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    
    if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval = null;
    }

    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
    
    sendTimeOnPageEvent(true);
  };
}

function sendTimeOnPageEvent(isFinal = false): void {
  if (!currentPath) return;

  const now = Date.now();
  if (isVisible && now - lastVisibleTime >= VISIBILITY_THRESHOLD_MS) {
    totalVisibleTime += now - lastVisibleTime;
    lastVisibleTime = now;
  }

  const totalTime = Math.floor((now - pageStartTime) / 1000);
  const visibleTime = Math.floor(totalVisibleTime / 1000);
  
  if (totalTime < 1) return;

  const engagementScore = totalTime > 0 ? Math.min(100, Math.round((visibleTime / totalTime) * 100)) : 0;

  const eventData: PageTimeData = {
    page_path: currentPath,
    visible_time_seconds: visibleTime,
    total_time_seconds: totalTime,
    engagement_score: engagementScore,
  };

  pushCustomEvent(isFinal ? "time_on_page_final" : "time_on_page", eventData);
}

function resetTracking(newPath: string): void {
  currentPath = newPath;
  pageStartTime = Date.now();
  lastVisibleTime = pageStartTime;
  totalVisibleTime = 0;
  isVisible = !document.hidden;
}
