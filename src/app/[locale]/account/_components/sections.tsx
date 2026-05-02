"use client";

import type { StorefrontAccount } from "@/api/proto-http/frontend";

import { AddressesSection } from "@/app/[locale]/account/sections/addresses";
import { EmailPreferences } from "@/app/[locale]/account/sections/email-preferences";

import { OrderReturns } from "../sections/order-returns";
import { PersonalInfo } from "../sections/personal-info";
import type { ActivePanel } from "../utils/utility";

type Props = {
  activePanel: ActivePanel;
  selectedCountryCode?: string;
  account: StorefrontAccount;
  addressOptions?: {
    editResetKey?: number;
    onEditModeChange?: (isEditing: boolean) => void;
  };
};

export function ActiveAccountSection({
  activePanel,
  selectedCountryCode,
  account,
  addressOptions,
}: Props) {
  switch (activePanel) {
    case "personal":
      return <PersonalInfo selectedCountryCode={selectedCountryCode} />;
    case "email":
      return <EmailPreferences />;
    case "addresses":
      return (
        <AddressesSection
          account={account}
          editResetKey={addressOptions?.editResetKey}
          onEditModeChange={addressOptions?.onEditModeChange}
        />
      );
    case "order&returns":
      return <OrderReturns account={account} />;
    default:
      return null;
  }
}
