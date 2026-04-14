"use client";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { AccountProfilePrompt } from "./_components/account-profile-prompt";
import { AccountSessionPanel } from "./_components/account-session-panel";
import { accountNeedsNameCompletion } from "./utils/utility";

export function AccountSignedInSection({
  account,
}: {
  account: StorefrontAccount;
}) {
  if (accountNeedsNameCompletion(account)) {
    return <AccountProfilePrompt account={account} />;
  }

  return <AccountSessionPanel account={account} />;
}
