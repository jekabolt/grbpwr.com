import { scrubEvent } from "./scrub";

// lekalo prod, and grbpwr's backend until it moves onto lekalo.
const PROD_BACKEND_HOSTNAMES = new Set([
  "api.lekalo.studio",
  "backend.grbpwr.com",
]);

/** "prod" for the storefront that talks to the prod backend, "beta" for everything else. */
export function sentryEnvironment(
  backendUrl: string | undefined,
): "prod" | "beta" {
  try {
    return PROD_BACKEND_HOSTNAMES.has(new URL(backendUrl ?? "").hostname)
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
