"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import {
  CHECKOUT_LOCATION_CHANGE_CANCELLED,
  clearCheckoutLocaleSwitchAccepted,
  isCheckoutLocaleSwitchAcceptedForAddress,
} from "@/lib/checkout-location-change";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";

import { AddressesSection } from "../sections/addresses";
import { useAddresses, type UseAddressesResult } from "../utils/use-addresses";
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
  addressesState: addressesStateFromParent,
  onDefaultChange,
  onAddNewAddress,
  onEditModeChange,
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
  onEditModeChange?: (isEditing: boolean) => void;
  /** When provided, reuses a parent fetch instead of calling useAddresses again. */
  addressesState?: UseAddressesResult;
}) {
  const t = useTranslations("account");
  const { currentCountry, setNextCountry, cancelNextCountry, nextCountry } =
    useTranslationsStore((s) => s);
  const [open, setOpen] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const dismissedLocaleSwitchForAddressRef = useRef<number | null>(null);

  const internalAddressesState = useAddresses({
    enabled: isSignedIn && !addressesStateFromParent,
    refreshKey,
    countryCode: currentCountry.countryCode,
  });
  const addressesState = addressesStateFromParent ?? internalAddressesState;

  const { pending, addresses, resolvedCheckoutAddress, countryAddress } =
    addressesState;

  const { savedAddressId, handleSavedAddressChange } = useSavedAddressFormSync({
    isSignedIn,
    addresses,
    resolvedCheckoutAddress,
    countryAddress,
    currentCountryCode: currentCountry.countryCode,
    profilePhone: account.phone?.trim(),
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

  const shouldSuggestLocaleSwitch =
    !!selectedAddress &&
    !isSameCountry(selectedAddress.country, currentCountry.countryCode);

  useEffect(() => {
    if (isDisabled && open) {
      setOpen(false);
    }
  }, [isDisabled, open]);

  useEffect(() => {
    function onLocaleSwitchDismissed() {
      const selectedAddressId = Number(selectedAddress?.id);
      if (Number.isFinite(selectedAddressId)) {
        dismissedLocaleSwitchForAddressRef.current = selectedAddressId;
      }
    }

    window.addEventListener(
      CHECKOUT_LOCATION_CHANGE_CANCELLED,
      onLocaleSwitchDismissed,
    );
    return () => {
      window.removeEventListener(
        CHECKOUT_LOCATION_CHANGE_CANCELLED,
        onLocaleSwitchDismissed,
      );
    };
  }, [selectedAddress?.id]);

  useEffect(() => {
    if (!selectedAddress?.id) {
      dismissedLocaleSwitchForAddressRef.current = null;
      if (nextCountry.savedAddressId != null) {
        cancelNextCountry();
      }
      return;
    }

    const selectedAddressId = Number(selectedAddress.id);
    if (!Number.isFinite(selectedAddressId)) return;

    if (!shouldSuggestLocaleSwitch) {
      dismissedLocaleSwitchForAddressRef.current = null;
      clearCheckoutLocaleSwitchAccepted();
      if (nextCountry.savedAddressId === selectedAddressId) {
        cancelNextCountry();
      }
      return;
    }

    if (
      dismissedLocaleSwitchForAddressRef.current === selectedAddressId ||
      isCheckoutLocaleSwitchAcceptedForAddress(
        selectedAddressId,
        selectedAddress.country,
      )
    ) {
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
        shared={addressesState}
        refreshKey={refreshKey}
        isCheckout={isCheckout}
        isDisabled={disabled || loading}
        onEditModeChange={(isEditing) => {
          setIsAddressEditing(isEditing);
          onEditModeChange?.(isEditing);
        }}
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
            variant="underline"
            className="uppercase underline"
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
