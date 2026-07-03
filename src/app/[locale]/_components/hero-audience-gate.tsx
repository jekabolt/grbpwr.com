"use client";

import { useEffect, useState, type ReactNode } from "react";
import type {
  AccountTierEnum,
  common_HeroAudience,
} from "@/api/proto-http/frontend";

import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";

// Tier ordering for the TIER audience: the account's tier is ranked by its
// position here (UNKNOWN=0 … MEMBER=4) and compared against the block's numeric
// `minTierId`. This mirrors the proto enum's declaration order.
const TIER_ORDER: AccountTierEnum[] = [
  "ACCOUNT_TIER_ENUM_UNKNOWN",
  "ACCOUNT_TIER_ENUM_PLUS",
  "ACCOUNT_TIER_ENUM_PLUS_PLUS",
  "ACCOUNT_TIER_ENUM_HACKER",
  "ACCOUNT_TIER_ENUM_MEMBER",
];

function tierRank(tier?: AccountTierEnum): number {
  const index = tier ? TIER_ORDER.indexOf(tier) : -1;
  return index < 0 ? 0 : index;
}

function isVisibleToViewer(
  audience: common_HeroAudience | undefined,
  minTierId: number | undefined,
  isSignedIn: boolean,
  accountTier: AccountTierEnum | undefined,
): boolean {
  switch (audience) {
    case "HERO_AUDIENCE_GUESTS":
      return !isSignedIn;
    case "HERO_AUDIENCE_MEMBERS":
      return isSignedIn;
    case "HERO_AUDIENCE_TIER":
      return isSignedIn && tierRank(accountTier) >= (minTierId ?? 0);
    // HERO_AUDIENCE_ALL / UNKNOWN / undefined → everyone.
    default:
      return true;
  }
}

// TARGETING modifier: gates a hero block by viewer audience (guests / members /
// tier ≥ N). The account is a client store hydrated after mount, so the gate is
// applied client-side: before mount it renders the block (matching the server
// HTML and the first client paint, keeping the cached homepage
// hydration-stable), then hides it post-hydration if the viewer doesn't match.
// Targeted blocks may flash briefly for the wrong audience — acceptable for
// marketing heroes. The /preview editor passes `preview` upstream so this gate is
// never applied there and the editor sees every block.
export function HeroAudienceGate({
  audience,
  minTierId,
  children,
}: {
  audience?: common_HeroAudience;
  minTierId?: number;
  children: ReactNode;
}) {
  const isSignedIn = useAccountOnboardingStore((s) => s.isSignedIn);
  const accountTier = useAccountOnboardingStore((s) => s.account?.accountTier);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return isVisibleToViewer(audience, minTierId, isSignedIn, accountTier) ? (
    <>{children}</>
  ) : null;
}
