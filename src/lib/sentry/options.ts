import { scrubEvent } from "./scrub";

const PROD_BACKEND_HOSTNAME = "backend.grbpwr.com";

/** "prod" for the storefront that talks to the prod backend, "beta" for everything else. */
export function sentryEnvironment(
  backendUrl: string | undefined,
): "prod" | "beta" {
  try {
    return new URL(backendUrl ?? "").hostname === PROD_BACKEND_HOSTNAME
      ? "prod"
      : "beta";
  } catch {
    return "beta";
  }
}

/**
 * Settings shared by the browser, Node and edge SDKs: errors only, no tracing, no trace
 * headers on outgoing requests, no personal data.
 */
export function sharedOptions(dsn: string) {
  return {
    dsn,
    environment: sentryEnvironment(process.env.NEXT_PUBLIC_BACKEND_URL),
    sendDefaultPii: false,
    tracesSampleRate: 0,
    tracePropagationTargets: [] as string[],
    beforeSend: scrubEvent,
  };
}
