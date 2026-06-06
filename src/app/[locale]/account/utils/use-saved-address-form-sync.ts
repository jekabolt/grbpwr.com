"use client";

import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { CHECKOUT_LOCATION_CHANGE_CANCELLED } from "@/lib/checkout-location-change";
import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";

import { promoteDefaultAddressForCountry } from "./address-actions";
import {
  applySavedAddressToCheckoutForm,
  CHECKOUT_SAVED_ADDRESS_FIELDS,
  checkoutAddressSelectionKey,
  checkoutFormMatchesAddress,
  isSameCountry,
  resolveCheckoutAddressSelection,
  snapshotCheckoutAddressFields,
} from "./utility";

type Params = {
  isSignedIn: boolean;
  addresses: StorefrontSavedAddress[];
  resolvedCheckoutAddress?: StorefrontSavedAddress;
  countryAddress?: StorefrontSavedAddress;
  currentCountryCode?: string;
  profilePhone?: string;
  onDefaultChange?: () => void;
};

export function useSavedAddressFormSync({
  isSignedIn,
  addresses,
  resolvedCheckoutAddress,
  countryAddress,
  currentCountryCode,
  profilePhone,
  onDefaultChange,
}: Params) {
  const { watch, setValue, getValues } = useFormContext();
  const rehydrated = useCheckoutStore((state) => state.rehydrated);
  const savedAddressId = watch("savedAddressId") as string | undefined;
  const formCountry = watch("country") as string | undefined;
  const appliedKeyRef = useRef<string | null>(null);
  const lastCountryRef = useRef(currentCountryCode);
  const restoreSnapshotRef = useRef<Record<string, string> | null>(null);

  const applyAddress = useCallback(
    (address: StorefrontSavedAddress) => {
      applySavedAddressToCheckoutForm(setValue, address, profilePhone);
    },
    [profilePhone, setValue],
  );

  const selectAddress = useCallback(
    (address: StorefrontSavedAddress) => {
      const key = checkoutAddressSelectionKey(address, currentCountryCode);
      appliedKeyRef.current = key;
      applyAddress(address);
      promoteDefaultAddressForCountry(
        address,
        currentCountryCode,
        onDefaultChange,
      );
    },
    [applyAddress, currentCountryCode, onDefaultChange],
  );

  useEffect(() => {
    if (!isSignedIn || !rehydrated || !addresses.length) return;

    if (lastCountryRef.current !== currentCountryCode) {
      appliedKeyRef.current = null;
      lastCountryRef.current = currentCountryCode;
    }

    const selected = resolveCheckoutAddressSelection(
      addresses,
      savedAddressId,
      resolvedCheckoutAddress,
      countryAddress,
      currentCountryCode,
    );
    if (!selected?.id) return;

    const key = checkoutAddressSelectionKey(selected, currentCountryCode);
    if (
      appliedKeyRef.current === key &&
      checkoutFormMatchesAddress(savedAddressId, formCountry, selected)
    ) {
      return;
    }

    selectAddress(selected);
  }, [
    addresses,
    countryAddress,
    currentCountryCode,
    formCountry,
    isSignedIn,
    rehydrated,
    resolvedCheckoutAddress,
    savedAddressId,
    selectAddress,
  ]);

  useEffect(() => {
    function restorePreviousSavedAddress() {
      const snapshot = restoreSnapshotRef.current;
      if (!snapshot) return;

      CHECKOUT_SAVED_ADDRESS_FIELDS.forEach((field) => {
        setValue(field, snapshot[field] ?? "", {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
      restoreSnapshotRef.current = null;
    }

    window.addEventListener(
      CHECKOUT_LOCATION_CHANGE_CANCELLED,
      restorePreviousSavedAddress,
    );
    return () => {
      window.removeEventListener(
        CHECKOUT_LOCATION_CHANGE_CANCELLED,
        restorePreviousSavedAddress,
      );
    };
  }, [setValue]);

  const handleSavedAddressChange = useCallback(
    (value: string) => {
      const id = Number(value);
      if (!Number.isFinite(id)) return;

      const selected = addresses.find((address) => address.id === id);
      if (!selected) return;

      if (
        !isSameCountry(selected.country, currentCountryCode) &&
        !restoreSnapshotRef.current
      ) {
        restoreSnapshotRef.current = snapshotCheckoutAddressFields(getValues());
      }

      selectAddress(selected);
    },
    [addresses, currentCountryCode, getValues, selectAddress],
  );

  return { savedAddressId, handleSavedAddressChange };
}
