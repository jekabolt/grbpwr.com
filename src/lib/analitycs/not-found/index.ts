import { pushCustomEvent } from "../utils";

export function sendPageNotFoundEvent(pagePath?: string): void {
  pushCustomEvent("page_not_found", {
    page_path: pagePath || (typeof window !== "undefined" ? window.location.pathname : ""),
    page_referrer: typeof document !== "undefined" ? document.referrer : "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
  });
}
