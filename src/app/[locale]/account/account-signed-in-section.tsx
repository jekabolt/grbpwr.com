"use client";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { AccountProfilePrompt } from "./_components/profile-prompt";
import { AccountSessionPanel } from "./_components/session-panel";
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
