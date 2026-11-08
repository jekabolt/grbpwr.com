import * as Sentry from "@sentry/nextjs";

import { sharedOptions } from "./options";

// BrowserSession is a default: it sends a session envelope on every page load and navigation,
// with no error in it. The others are not defaults; listed so a future default stays off.
const OFF = new Set([
  "BrowserSession",
  "Replay",
  "ReplayCanvas",
  "BrowserTracing",
  "Feedback",
]);

let started = false;

/** Starts the browser SDK once. Session Replay stays off on the storefront. */
export function start(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (started || !dsn) return;
  started = true;
  Sentry.init({
    ...sharedOptions(dsn),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: (defaults) => defaults.filter((i) => !OFF.has(i.name)),
  });
}

/** An error an error page rendered instead of the route. */
export function captureErrorPage(error: unknown): void {
  start();
  Sentry.captureException(error, {
    mechanism: { handled: true, type: "auto.function.nextjs.error_page" },
  });
}
