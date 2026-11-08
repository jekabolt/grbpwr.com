/**
 * Reports an error that an error page caught. A no-op unless the build had
 * NEXT_PUBLIC_SENTRY_DSN. An error with a digest was thrown on the server and is reported
 * there (onRequestError), so it is not sent twice.
 */
export function reportErrorPage(error: Error & { digest?: string }): void {
  if (process.env.SENTRY_IN_BUILD) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && !error.digest) {
      void import("./client")
        .then((m) => m.captureErrorPage(error))
        .catch(() => undefined);
    }
  }
}
