"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";

import { AddressesSection } from "../sections/addresses";
import { useAddresses } from "../utils/use-addresses";
import { useSavedAddressFormSync } from "../utils/use-saved-address-form-sync";
import { getCountryMeta, isSameCountry } from "../utils/utility";
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
  onAddNewAddress?: (options?: { saveOnly?: boolean }) => void;
}) {
  const t = useTranslations("account");
  const { currentCountry, setNextCountry, cancelNextCountry, nextCountry } =
    useTranslationsStore((s) => s);
  const [open, setOpen] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const hasTriggeredNewAddressPickerRef = useRef(false);

  const { pending, addresses, defaultAddress } = useAddresses({
    enabled: isSignedIn,
    refreshKey,
  });

  const { savedAddressId, handleSavedAddressChange } = useSavedAddressFormSync({
    isSignedIn,
    addresses,
    defaultAddress,
    currentCountryCode: currentCountry.countryCode,
    onDefaultChange,
  });

  const isDisabled = disabled || pending || loading || addresses.length <= 1;
  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address) => String(address.id ?? "") === String(savedAddressId ?? ""),
      ),
    [addresses, savedAddressId],
  );

  const shouldOpenNewAddressPicker =
    !!defaultAddress &&
    !isSameCountry(defaultAddress.country, currentCountry.countryCode);
  const shouldSuggestLocaleSwitch =
    !!selectedAddress &&
    !isSameCountry(selectedAddress.country, currentCountry.countryCode);

  useEffect(() => {
    if (isDisabled && open) {
      setOpen(false);
    }
  }, [isDisabled, open]);

  useEffect(() => {
    if (!onAddNewAddress) return;
    if (!shouldOpenNewAddressPicker) {
      hasTriggeredNewAddressPickerRef.current = false;
      return;
    }
    if (hasTriggeredNewAddressPickerRef.current) return;

    hasTriggeredNewAddressPickerRef.current = true;
    onAddNewAddress({ saveOnly: true });
  }, [onAddNewAddress, shouldOpenNewAddressPicker]);

  useEffect(() => {
    if (!selectedAddress?.id) {
      if (nextCountry.savedAddressId != null) {
        cancelNextCountry();
      }
      return;
    }

    const selectedAddressId = Number(selectedAddress.id);
    if (!Number.isFinite(selectedAddressId)) return;

    if (!shouldSuggestLocaleSwitch) {
      if (nextCountry.savedAddressId === selectedAddressId) {
        cancelNextCountry();
      }
      return;
    }

    const selectedCountryMeta = getCountryMeta(selectedAddress.country);
    if (!selectedCountryMeta) return;

    setNextCountry({
      name: selectedCountryMeta.name,
      countryCode: selectedCountryMeta.countryCode,
      currencyKey: selectedCountryMeta.currencyKey,
      savedAddressId: selectedAddressId,
      localeCode: selectedCountryMeta.lng,
    });
  }, [
    cancelNextCountry,
    nextCountry.savedAddressId,
    selectedAddress,
    setNextCountry,
    shouldSuggestLocaleSwitch,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AddressesSection
        account={account}
        defaultOnly={defaultOnly}
        refreshKey={refreshKey}
        isCheckout={isCheckout}
        isDisabled={disabled || loading}
        onEditModeChange={setIsAddressEditing}
      />
      {!isAddressEditing && (
        <div className="flex w-full items-end justify-between">
          <div className="w-auto">
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

          <Button
            type="button"
            className="border-b border-textColor uppercase"
            onClick={() => onAddNewAddress?.()}
            disabled={disabled || loading}
          >
            {`+ ${t("add new address")}`}
          </Button>
        </div>
      )}
    </div>
  );
}
