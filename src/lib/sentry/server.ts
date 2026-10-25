import * as Sentry from "@sentry/nextjs";

import { sharedOptions } from "./options";

/** Starts the Node or edge SDK (the import resolves per runtime). */
export function start(dsn: string): void {
  Sentry.init(sharedOptions(dsn));
}
