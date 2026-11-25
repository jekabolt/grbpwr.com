// Packs: code-level extras of one shop that no other shop may get (grbpwr's
// analytics, copy, legal markdown, icons). Only the operator assigns a pack (the
// profile's `pack` field); until the backend sends that field, grbpwr's own
// hosts count as grbpwr. Pure module: middleware, server, browser, node tests.
import { GRBPWR_HOSTS, GRBPWR_PACK } from "./grbpwr/config.ts";

export type ShopPack = typeof GRBPWR_PACK;

/**
 * The pack of a shop. `profilePack` is the profile's `pack` field as sent:
 * undefined = the backend does not send the field yet (fall back to the host),
 * any string (even "") = the operator's word, the host no longer matters.
 */
export function resolvePack(
  profilePack: string | undefined | null,
  host: string | null | undefined,
): ShopPack | undefined {
  if (typeof profilePack === "string") {
    return profilePack.trim().toLowerCase() === GRBPWR_PACK
      ? GRBPWR_PACK
      : undefined;
  }
  return host && GRBPWR_HOSTS.includes(host) ? GRBPWR_PACK : undefined;
}
