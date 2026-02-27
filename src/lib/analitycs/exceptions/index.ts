import { pushCustomEvent } from "../utils";

export function initExceptionTracking(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (e) => {
    pushCustomEvent("exception", {
      description: e.message || "Unknown error",
      fatal: false,
      page_path: window.location.pathname,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const message =
      e.reason instanceof Error ? e.reason.message : String(e.reason);
    pushCustomEvent("exception", {
      description: message || "Unhandled promise rejection",
      fatal: false,
      page_path: window.location.pathname,
    });
  });
}
