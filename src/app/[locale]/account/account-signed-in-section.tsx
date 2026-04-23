"use client";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { AccountProfilePrompt } from "./authorization/profile-form";
import { AccountSessionPanel } from "./sections/session-panel";
import { accountNeedsNameCompletion } from "./utils/utility";

export function AccountSignedInSection({
  account,
  isCheckout,
  onProfileCompleted,
}: {
  account: StorefrontAccount;
  isCheckout?: boolean;
  onProfileCompleted?: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
  }) => void;
}) {
  if (accountNeedsNameCompletion(account)) {
    return (
      <AccountProfilePrompt
        account={account}
        onCompleted={onProfileCompleted}
      />
    );
  }

  return (
    <div className="h-full w-full px-2.5 pt-24 lg:px-32 lg:py-24">
      {!isCheckout && <AccountSessionPanel account={account} />}
    </div>
  );
}
