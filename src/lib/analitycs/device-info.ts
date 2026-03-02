/**
 * Lightweight UA parsing for analytics. Extracts browser, device_category, viewport.
 * Aligns with GA4 device.web_info.browser for BQ error-rate breakdowns.
 */
export interface DeviceInfo {
  browser: string;
  browser_version: string;
  device_category: "mobile" | "tablet" | "desktop";
  viewport_width: number;
  viewport_height: number;
}

function parseBrowser(ua: string): { browser: string; version: string } {
  if (ua.includes("Edg/")) {
    const m = ua.match(/Edg\/([\d.]+)/);
    return { browser: "Edge", version: m?.[1] ?? "" };
  }
  if (ua.includes("OPR/") || ua.includes("Opera/")) {
    const m = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    return { browser: "Opera", version: m?.[1] ?? "" };
  }
  if (ua.includes("Chrome/")) {
    const m = ua.match(/Chrome\/([\d.]+)/);
    return { browser: "Chrome", version: m?.[1] ?? "" };
  }
  if (ua.includes("Firefox/")) {
    const m = ua.match(/Firefox\/([\d.]+)/);
    return { browser: "Firefox", version: m?.[1] ?? "" };
  }
  if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    const m = ua.match(/Version\/([\d.]+)/);
    return { browser: "Safari", version: m?.[1] ?? "" };
  }
  if (ua.includes("MSIE") || ua.includes("Trident/")) {
    const m = ua.match(/(?:MSIE |rv:)([\d.]+)/);
    return { browser: "IE", version: m?.[1] ?? "" };
  }
  return { browser: "unknown", version: "" };
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      browser: "unknown",
      browser_version: "",
      device_category: "desktop",
      viewport_width: 0,
      viewport_height: 0,
    };
  }

  const ua = navigator.userAgent;
  const { browser, version } = parseBrowser(ua);

  const w = window.innerWidth;
  const h = window.innerHeight;
  const device_category: DeviceInfo["device_category"] =
    w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";

  return {
    browser,
    browser_version: version,
    device_category,
    viewport_width: w,
    viewport_height: h,
  };
}
