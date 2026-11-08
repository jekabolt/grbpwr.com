// Browser error reporting (Sentry). Both values are inlined at build time: without a DSN this
// branch is dropped, so no SDK code is bundled, loaded or run.
if (process.env.SENTRY_IN_BUILD) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    void import("./lib/sentry/client").then((m) => m.start());
  }
}

export {};
