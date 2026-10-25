import * as Sentry from "@sentry/nextjs";

import { sharedOptions } from "./options";

// Never part of the default integrations; listed so a future default cannot switch them on.
const OFF = new Set(["Replay", "ReplayCanvas", "BrowserTracing", "Feedback"]);

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
