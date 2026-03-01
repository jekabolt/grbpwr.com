import { pushCustomEvent } from "../utils";

const THRESHOLDS = [25, 50, 75, 100] as const;

export function initScrollDepthTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const reached = new Set<number>();
  let currentPath = window.location.pathname;
  let ticking = false;

  function checkThresholds() {
    const path = window.location.pathname;
    if (path !== currentPath) {
      currentPath = path;
      reached.clear();
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const threshold of THRESHOLDS) {
      if (pct >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        pushCustomEvent("scroll_depth", {
          percent_scrolled: threshold,
          page_path: currentPath,
          page_title: document.title,
        });
      }
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      checkThresholds();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
