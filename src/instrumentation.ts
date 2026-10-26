import type { Instrumentation } from "next";

// Server and edge error reporting (Sentry). SENTRY_IN_BUILD is "" unless the build had a DSN
// (next.config.ts), and then the SDK is not even bundled. SENTRY_DSN unset at runtime: the SDK
// is never loaded and onRequestError does nothing.
function serverDsn(): string {
  return process.env.SENTRY_DSN?.trim() ?? "";
}

// NEXT_RUNTIME is compared inline so each runtime's bundle keeps only its own SDK start.
export async function register(): Promise<void> {
  if (process.env.SENTRY_IN_BUILD) {
    const dsn = serverDsn();
    if (dsn && process.env.NEXT_RUNTIME === "nodejs") {
      (await import("./lib/sentry/server-node")).start(dsn);
    }
    if (dsn && process.env.NEXT_RUNTIME === "edge") {
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
