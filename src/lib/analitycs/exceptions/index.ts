import { getDeviceInfo } from "../device-info";
import { pushCustomEvent } from "../utils";

function getExceptionParams(description: string) {
  const device = getDeviceInfo();
  return {
    description,
    fatal: false,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    browser: device.browser,
    browser_version: device.browser_version,
    device_category: device.device_category,
    viewport_width: device.viewport_width,
    viewport_height: device.viewport_height,
  };
}

export function initExceptionTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const errorHandler = (e: ErrorEvent) => {
    pushCustomEvent("exception", getExceptionParams(e.message || "Unknown error"));
  };

  const rejectionHandler = (e: PromiseRejectionEvent) => {
    const message =
      e.reason instanceof Error ? e.reason.message : String(e.reason);
    pushCustomEvent(
      "exception",
      getExceptionParams(message || "Unhandled promise rejection"),
    );
  };

  window.addEventListener("error", errorHandler);
  window.addEventListener("unhandledrejection", rejectionHandler);

  return () => {
    window.removeEventListener("error", errorHandler);
    window.removeEventListener("unhandledrejection", rejectionHandler);
  };
}
