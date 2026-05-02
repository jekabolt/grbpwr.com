"use client";

import { useState } from "react";
import Link from "next/link";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { type AccountSection, type ActivePanel } from "../utils/utility";
import { AccountSectionContent } from "./account-section-content";

type Props = {
  account: StorefrontAccount;
  section: AccountSection;
};

export function AccountMobileSectionPage({ account, section }: Props) {
  const t = useTranslations("account");
  const activePanel = section.value as ActivePanel;
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressEditResetKey, setAddressEditResetKey] = useState(0);
  const isAddressEditHeader = activePanel === "addresses" && isEditingAddress;
  const sectionLabel = isAddressEditHeader
    ? "edit shipping address"
    : t(section.label);

  function closeAddressEditMode() {
    setIsEditingAddress(false);
    setAddressEditResetKey((key) => key + 1);
  }

  return (
    <div className="min-h-screen w-full px-2.5 pb-24 pt-20 lg:hidden">
      <div className="mb-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-textColor pb-3">
          {isAddressEditHeader ? (
            <div />
          ) : (
            <Button
              asChild
              className="justify-self-start px-1 py-2 leading-none"
            >
              <Link href="/account">{"<"}</Link>
            </Button>
          )}
          <Text variant="uppercase" className="text-center">
            {sectionLabel}
          </Text>
          {isAddressEditHeader ? (
            <Button
              type="button"
              className="justify-self-end leading-none"
              onClick={closeAddressEditMode}
            >
              [x]
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
      <AccountSectionContent
        account={account}
        activePanel={activePanel}
        addressOptions={{
          editResetKey: addressEditResetKey,
          onEditModeChange: setIsEditingAddress,
        }}
      />
    </div>
  );
}
