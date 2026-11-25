// Which publishable key (and connected account) the checkout loads Stripe with.
// Pure module, covered by the node test runner.
import type { ShopPack } from "../../brands/index.ts";

export type StripeLoadArgs = {
  publishableKey: string;
  stripeAccount?: string;
};

/**
 * - the shop's own key from its profile (with its connected account, if any);
 * - a connected account without a key → the platform key on that account;
 * - neither: only the grbpwr pack falls back to its key from env (as before
 *   lekalo); any other shop gets no Stripe at all — never the platform key on
 *   the platform's own account.
 */
export function stripeLoadArgs(input: {
  profileKey?: string;
  accountId?: string;
  pack?: ShopPack;
  platformKey?: string;
  grbpwrKey?: string;
}): StripeLoadArgs | null {
  const profileKey = input.profileKey?.trim();
  const accountId = input.accountId?.trim();
  if (profileKey) {
    return accountId
      ? { publishableKey: profileKey, stripeAccount: accountId }
      : { publishableKey: profileKey };
  }
  const platformKey = input.platformKey?.trim();
  if (accountId) {
    return platformKey
      ? { publishableKey: platformKey, stripeAccount: accountId }
      : null;
  }
  if (input.pack) {
    const key = input.grbpwrKey?.trim() || platformKey;
    return key ? { publishableKey: key } : null;
  }
  return null;
}
