import * as Sentry from "@sentry/nextjs";

import { sharedOptions } from "./options";

/**
 * Starts the Node SDK with no session data. The default Http integration tracks incoming
 * requests as sessions (a `sessions` envelope every minute, no error in it); ProcessSession
 * sends a process-wide session on the first unhandled error. Errors are reported as before.
 */
export function start(dsn: string): void {
  Sentry.init({
    ...sharedOptions(dsn),
    integrations: (defaults) =>
      defaults
        .filter((integration) => integration.name !== "ProcessSession")
        .map((integration) =>
          integration.name === "Http"
            ? Sentry.httpIntegration({
                disableIncomingRequestSpans: true,
                trackIncomingRequestsAsSessions: false,
              })
            : integration,
        ),
  });
}
