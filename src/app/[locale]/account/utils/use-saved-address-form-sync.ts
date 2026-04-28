"use client";

import { useCallback, useEffect, useRef } from "react";
import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";
import { useFormContext } from "react-hook-form";

import { setDefaultAddressRequest } from "./address-actions";

type Params = {
  isSignedIn: boolean;
  addresses: StorefrontSavedAddress[];
  defaultAddress: StorefrontSavedAddress | undefined;
  currentCountryCode?: string;
  onDefaultChange?: () => void;
};

function isSameCountry(addressCountry?: string, currentCountryCode?: string) {
  if (!currentCountryCode) return true;
  return (
    addressCountry?.trim().toLowerCase() ===
    currentCountryCode.trim().toLowerCase()
  );
}

export function useSavedAddressFormSync({
  isSignedIn,
  addresses,
  defaultAddress,
  currentCountryCode,
  onDefaultChange,
}: Params) {
  const { watch, setValue } = useFormContext();
  const savedAddressId = watch("savedAddressId") as string | undefined;
  const appliedSavedAddressRef = useRef(false);

  const applySavedAddressToForm = useCallback(
    (address: StorefrontSavedAddress) => {
      if (!address) return;

      const idStr = address.id != null ? String(address.id) : "";
      setValue("savedAddressId", idStr, { shouldValidate: false });

      setValue("country", (address.country ?? "").trim().toLowerCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("state", (address.state ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("city", (address.city ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("address", (address.addressLineOne ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("additionalAddress", (address.addressLineTwo ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("company", (address.company ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("postalCode", (address.postalCode ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  useEffect(() => {
    if (!isSignedIn) return;
    if (!addresses.length) return;
    if (appliedSavedAddressRef.current) return;
    if (!defaultAddress?.id) return;

    const selected = savedAddressId?.trim()
      ? addresses.find((address) => String(address.id ?? "") === savedAddressId)
      : defaultAddress;

    if (
      selected === defaultAddress &&
      !isSameCountry(defaultAddress.country, currentCountryCode)
    ) {
      return;
    }

    applySavedAddressToForm(selected ?? defaultAddress);

    appliedSavedAddressRef.current = true;
  }, [
    addresses,
    applySavedAddressToForm,
    currentCountryCode,
    defaultAddress,
    isSignedIn,
    savedAddressId,
  ]);

  const handleSavedAddressChange = useCallback(
    (value: string) => {
      const id = Number(value);
      if (!Number.isFinite(id)) return;

      const selected = addresses.find((address) => address.id === id);
      if (!selected) return;

      appliedSavedAddressRef.current = true;
      applySavedAddressToForm(selected);

      if (!isSameCountry(selected.country, currentCountryCode)) {
        return;
      }

      void setDefaultAddressRequest(id)
        .catch(() => {})
        .finally(() => {
          onDefaultChange?.();
        });
    },
    [addresses, applySavedAddressToForm, currentCountryCode, onDefaultChange],
  );

  return {
    savedAddressId,
    handleSavedAddressChange,
  };
}
