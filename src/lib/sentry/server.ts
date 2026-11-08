import * as Sentry from "@sentry/nextjs";

import { sharedOptions } from "./options";

/** Starts the edge SDK (middleware). Node starts from ./server-node. */
export function start(dsn: string): void {
  Sentry.init(sharedOptions(dsn));
}
