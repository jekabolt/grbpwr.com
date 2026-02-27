import { pushCustomEvent } from "../utils";

export function initExceptionTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const errorHandler = (e: ErrorEvent) => {
    pushCustomEvent("exception", {
      description: e.message || "Unknown error",
      fatal: false,
      page_path: window.location.pathname,
    });
  };

  const rejectionHandler = (e: PromiseRejectionEvent) => {
    const message =
      e.reason instanceof Error ? e.reason.message : String(e.reason);
    pushCustomEvent("exception", {
      description: message || "Unhandled promise rejection",
      fatal: false,
      page_path: window.location.pathname,
    });
  };

  window.addEventListener("error", errorHandler);
  window.addEventListener("unhandledrejection", rejectionHandler);

  return () => {
    window.removeEventListener("error", errorHandler);
    window.removeEventListener("unhandledrejection", rejectionHandler);
  };
}
