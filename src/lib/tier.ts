import type {
  AccountTierEnum,
  StorefrontColorway,
} from "@/api/proto-http/frontend";

/**
 * Maps a viewer's account tier onto the loyalty-tier CODE space used by
 * `StorefrontColorway.required_tier` (0=member, 1=plus, 2=plus_plus,
 * 99=hacker/invite-only). This code space is distinct from the `AccountTierEnum`
 * wire enum: a viewer qualifies to buy a gated product when their code is >= the
 * product's `required_tier`.
 *
 * UNKNOWN and MEMBER both map to 0 (the ungated floor); HACKER jumps to 99 so an
 * invite-only account clears every gate.
 */
export function accountTierToCode(tier?: AccountTierEnum): number {
  switch (tier) {
    case "ACCOUNT_TIER_ENUM_PLUS":
      return 1;
    case "ACCOUNT_TIER_ENUM_PLUS_PLUS":
      return 2;
    case "ACCOUNT_TIER_ENUM_HACKER":
      return 99;
    // ACCOUNT_TIER_ENUM_MEMBER, ACCOUNT_TIER_ENUM_UNKNOWN, undefined → 0
    default:
      return 0;
  }
}

/**
 * Whether a colourway is a locked teaser for `accountTier` — fully renderable
 * but not purchasable.
 *
 * Storefront catalogue and PDP reads are anonymous (`lib/api.ts` sends no auth),
 * so the backend-computed `product.locked` flag arrives guest-relative (tier 0):
 * `false` means the piece is ungated (open to everyone), `true` means it is
 * tier-gated. For a gated piece we therefore recompute *this* viewer's access
 * from the viewer-independent `required_tier` against their own tier code — the
 * client knows the real tier the anonymous server never saw. `required_tier`
 * is always present on the wire (0 for ordinary products); the `product.locked`
 * flag is only used as a defensive fallback when it is somehow absent.
 */
export function isProductLocked(
  product: Pick<StorefrontColorway, "locked" | "requiredTier">,
  accountTier?: AccountTierEnum,
): boolean {
  const requiredCode = product.requiredTier ?? 0;
  // Gated: decide for this viewer. accountTierToCode(undefined) === 0, so guests
  // (and MEMBER/UNKNOWN) are locked out of anything with required_tier > 0.
  if (requiredCode > 0) {
    return accountTierToCode(accountTier) < requiredCode;
  }
  // Ungated by tier — honour an explicit backend lock if one is present.
  return product.locked ?? false;
}

/**
 * Where a locked teaser routes instead of the PDP: guests to sign-in, signed-in
 * lower-tier members to their account (tier privileges / how to level up).
 */
export function lockedTeaserHref(isSignedIn: boolean): string {
  return isSignedIn ? "/account" : "/login";
}
