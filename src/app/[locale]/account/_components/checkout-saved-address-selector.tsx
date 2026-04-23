"use client";

import { useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { AddressesSection } from "../sections/addresses";
import { useAddresses } from "../utils/use-addresses";
import { useSavedAddressFormSync } from "../utils/use-saved-address-form-sync";
import { AddressesSelector } from "./addresses-selector";

export function CheckoutSavedAddressSelector({
  loading,
  disabled,
  isSignedIn,
  refreshKey,
  account,
  defaultOnly,
  isCheckout,
  onDefaultChange,
  onAddNewAddress,
}: {
  loading: boolean;
  disabled?: boolean;
  isSignedIn: boolean;
  refreshKey?: number;
  account: StorefrontAccount;
  defaultOnly?: boolean;
  isCheckout?: boolean;
  onDefaultChange?: () => void;
  onAddNewAddress?: () => void;
}) {
  const t = useTranslations("account");
  const [open, setOpen] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  const { pending, addresses, defaultAddress } = useAddresses({
    enabled: isSignedIn,
    refreshKey,
  });

  const { savedAddressId, handleSavedAddressChange } = useSavedAddressFormSync({
    isSignedIn,
    addresses,
    defaultAddress,
    onDefaultChange,
  });

  const isDisabled = disabled || pending || loading || !addresses.length;

  return (
    <div className="flex flex-col gap-6">
      <AddressesSection
        account={account}
        defaultOnly={defaultOnly}
        refreshKey={refreshKey}
        isCheckout={isCheckout}
        onEditModeChange={setIsAddressEditing}
      />
      {!isAddressEditing && (
        <div className="flex items-end justify-between">
          <Button
            type="button"
            variant="underline"
            className="uppercase"
            onClick={onAddNewAddress}
            disabled={disabled || loading}
          >
            {`+ ${t("add new address")}`}
          </Button>
          <div className="w-48">
            <AddressesSelector
              savedAddressId={savedAddressId || ""}
              handleValueChange={handleSavedAddressChange}
              open={open}
              setOpen={setOpen}
              isDisabled={isDisabled}
              addresses={addresses}
              account={account}
            />
          </div>
        </div>
      )}
    </div>
  );
}
