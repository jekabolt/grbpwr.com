import type { StorefrontAccount } from "@/api/proto-http/frontend";
import type { AccountProfile } from "@/lib/stores/account-onboarding/store-types";

let accountSessionPromise: Promise<StorefrontAccount | null> | null = null;

export function storefrontAccountToProfile(
  account: StorefrontAccount,
): AccountProfile {
  return {
    firstName: account.firstName?.trim() ?? "",
    lastName: account.lastName?.trim() ?? "",
    email: account.email?.trim() ?? "",
    accountTier: account.accountTier,
  };
}

export function resolveAccountSession(): Promise<StorefrontAccount | null> {
  if (accountSessionPromise) return accountSessionPromise;

  accountSessionPromise = fetch("/api/account/me", {
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) return null;

      const payload = (await response.json()) as {
        account?: StorefrontAccount | null;
      };
      return payload.account ?? null;
    })
    .catch(() => null)
    .finally(() => {
      accountSessionPromise = null;
    });

  return accountSessionPromise;
}
