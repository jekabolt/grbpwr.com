// The shop of the current RSC render, taken from the `[shop]` path segment the
// middleware rewrites every page to. Statically rendered (ISR) pages have no
// request headers, so the segment is the only place the host comes from.
//
// Next renders layouts, pages and generateMetadata independently, so each of
// them calls setRequestShop(params.shop) first (the same pattern next-intl
// uses for setRequestLocale). React cache() scopes the store to one request.
import { cache } from "react";

import { normalizeShopHost } from "./host.ts";

const store = cache((): { host: string | null } => ({ host: null }));

/** Records the `[shop]` segment for this render; returns the normalized host or null. */
export function setRequestShop(
  segment: string | undefined | null,
): string | null {
  let raw = segment ?? "";
  try {
    raw = decodeURIComponent(raw);
  } catch {
    raw = "";
  }
  // A shop host always has a dot; anything else is not a rewritten page path.
  const host = raw.includes(".") ? normalizeShopHost(raw) : null;
  if (host) store().host = host;
  return host;
}

/** Host recorded by setRequestShop in this render, if any. */
export function getRequestShop(): string | null {
  return store().host;
}

/** setRequestShop from a page/layout `params` promise (its `shop` key). */
export async function setRequestShopFrom(
  params: Promise<object>,
): Promise<string | null> {
  const { shop } = (await params) as { shop?: string };
  return setRequestShop(shop);
}
