"use client";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import type {
  PrivacyUiStatus,
  PromptStatus,
} from "@/lib/stores/account-onboarding/store-types";
import { Text } from "@/components/ui/text";

import { AccountPhonePrompt } from "./_components/account-phone-prompt";
import { LegalNoticesActions } from "./_components/legal-notices-actions";
import { AccountSessionPanel } from "./account-session-panel";

type AccountSignedInPhase = "loading" | "privacy" | "phone" | "session";

function accountSignedInPhase(
  rehydrated: boolean,
  privacy: PrivacyUiStatus,
  phonePrompt: PromptStatus,
): AccountSignedInPhase {
  if (!rehydrated) return "loading";
  if (privacy === "pending") return "privacy";
  if (phonePrompt === "pending") return "phone";
  return "session";
}

export function AccountSignedInSection({
  account,
}: {
  account: StorefrontAccount;
}) {
  const privacy = useAccountOnboardingStore((s) => s.privacy);
  const phonePrompt = useAccountOnboardingStore((s) => s.phonePrompt);
  const rehydrated = useAccountOnboardingStore((s) => s.rehydrated);
  const setPrivacy = useAccountOnboardingStore((s) => s.setPrivacy);
  const setPhonePrompt = useAccountOnboardingStore((s) => s.setPhonePrompt);

  const phase = accountSignedInPhase(rehydrated, privacy, phonePrompt);

  switch (phase) {
    case "loading":
      return (
        <Text variant="uppercase" className="text-center">
          loading…
        </Text>
      );
    case "privacy":
      return (
        <LegalNoticesActions
          onAccept={() => setPrivacy("accepted")}
          onSkip={() => setPrivacy("skipped")}
        />
      );
    case "phone":
      return (
        <AccountPhonePrompt
          account={account}
          onSaved={() => setPhonePrompt("done")}
          onSkipped={() => setPhonePrompt("skipped")}
        />
      );
    case "session":
      return <AccountSessionPanel account={account} />;
    default: {
      const _exhaustive: never = phase;
      return _exhaustive;
    }
  }
}
