"use client";

import { useEffect, useState } from "react";
import type { AccountTierEnum } from "@/api/proto-http/frontend";

import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";

export type ViewerTier = {
  accountTier?: AccountTierEnum;
  isSignedIn: boolean;
};

/**
 * The viewer's loyalty tier + auth state for gating locked teasers, resolved the
 * same way as `hero-audience-gate`: before mount it reports the anonymous
 * (guest) viewer so the first client paint matches the statically-cached
 * catalogue HTML (the catalog route is `force-static`), then the hydrated
 * account store takes over. Keeping the pre-mount value guest-shaped is what
 * keeps tier-dependent card rendering hydration-stable; a signed-in qualifying
 * viewer sees a brief locked→unlocked settle, matching the hero gate's tradeoff.
 */
export function useViewerTier(): ViewerTier {
  const isSignedIn = useAccountOnboardingStore((s) => s.isSignedIn);
  const accountTier = useAccountOnboardingStore((s) => s.account?.accountTier);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return { accountTier: undefined, isSignedIn: false };
  return { accountTier, isSignedIn };
}
