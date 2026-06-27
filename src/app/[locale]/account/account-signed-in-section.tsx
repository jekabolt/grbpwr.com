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
    const prompt = (
      <AccountProfilePrompt account={account} onCompleted={onProfileCompleted} />
    );
    return isCheckout ? (
      prompt
    ) : (
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        {prompt}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col pt-24 lg:px-48 lg:pb-0 lg:pt-24">
      {!isCheckout && (
        <div className="flex min-h-0 flex-1 flex-col">
          <AccountSessionPanel account={account} />
        </div>
      )}
    </div>
  );
}
