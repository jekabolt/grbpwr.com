import { getDeviceInfo } from "../device-info";
import { pushCustomEvent, sanitizeAnalyticsPath } from "../utils";

// An error loop (e.g. a render that throws every frame) can emit thousands of
// identical exceptions and drown a GA4 property. Cap the volume per page load
// and drop repeats of a message we've already reported.
const MAX_EXCEPTIONS_PER_PAGE = 10;
let exceptionCount = 0;
const reportedMessages = new Set<string>();

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

function reportException(rawMessage: string): void {
  // Error text can carry an email or a URL with PII (e.g. a failed request to an
  // order URL); scrub before it leaves the browser. `description` is not one of
  // the keys pushCustomEvent strips, so redact here at the source.
  const message = sanitizeAnalyticsPath(rawMessage || "Unknown error");
  if (reportedMessages.has(message)) return;
  if (exceptionCount >= MAX_EXCEPTIONS_PER_PAGE) return;
  reportedMessages.add(message);
  exceptionCount += 1;
  pushCustomEvent("exception", getExceptionParams(message));
}

export function initExceptionTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const errorHandler = (e: ErrorEvent) => {
    reportException(e.message || "Unknown error");
  };

  const rejectionHandler = (e: PromiseRejectionEvent) => {
    const message =
      e.reason instanceof Error ? e.reason.message : String(e.reason);
    reportException(message || "Unhandled promise rejection");
  };

  window.addEventListener("error", errorHandler);
  window.addEventListener("unhandledrejection", rejectionHandler);

  return () => {
    window.removeEventListener("error", errorHandler);
    window.removeEventListener("unhandledrejection", rejectionHandler);
  };
}
