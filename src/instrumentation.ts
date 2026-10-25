import type { Instrumentation } from "next";

// Server and edge error reporting (Sentry). SENTRY_IN_BUILD is "" unless the build had a DSN
// (next.config.ts), and then the SDK is not even bundled. SENTRY_DSN unset at runtime: the SDK
// is never loaded and onRequestError does nothing.
function serverDsn(): string {
  return process.env.SENTRY_DSN?.trim() ?? "";
}

export async function register(): Promise<void> {
  if (process.env.SENTRY_IN_BUILD) {
    const dsn = serverDsn();
    const runtime = process.env.NEXT_RUNTIME;
    if (dsn && (runtime === "nodejs" || runtime === "edge")) {
      (await import("./lib/sentry/server")).start(dsn);
    }
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  ...args
) => {
  if (process.env.SENTRY_IN_BUILD) {
    if (serverDsn()) {
      (await import("@sentry/nextjs")).captureRequestError(...args);
    }
  }
};
