"use client";

import { useCallback, useEffect, useRef } from "react";
import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";
import { useFormContext } from "react-hook-form";

import { setDefaultAddressRequest } from "./address-actions";

type Params = {
  isSignedIn: boolean;
  addresses: StorefrontSavedAddress[];
  defaultAddress: StorefrontSavedAddress | undefined;
  onDefaultChange?: () => void;
};

export function useSavedAddressFormSync({
  isSignedIn,
  addresses,
  defaultAddress,
  onDefaultChange,
}: Params) {
  const { watch, setValue, getValues } = useFormContext();
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

    const currentAddress = getValues("address")?.trim() ?? "";
    const currentPostalCode = getValues("postalCode")?.trim() ?? "";
    const hasShippingAddressValues = !!currentAddress || !!currentPostalCode;
    const hasSavedAddressSelection = !!savedAddressId?.trim();

    if (hasShippingAddressValues) {
      if (!hasSavedAddressSelection) {
        setValue("savedAddressId", String(defaultAddress.id), {
          shouldValidate: false,
        });
      }
      appliedSavedAddressRef.current = true;
      return;
    }

    if (!hasSavedAddressSelection || savedAddressId === "") {
      applySavedAddressToForm(defaultAddress);
    } else {
      const selected = addresses.find(
        (address) => String(address.id ?? "") === savedAddressId,
      );
      if (selected) applySavedAddressToForm(selected);
    }

    appliedSavedAddressRef.current = true;
  }, [
    addresses,
    applySavedAddressToForm,
    defaultAddress,
    getValues,
    isSignedIn,
    savedAddressId,
    setValue,
  ]);

  const handleSavedAddressChange = useCallback(
    (value: string) => {
      const id = Number(value);
      if (!Number.isFinite(id)) return;

      const selected = addresses.find((address) => address.id === id);
      if (!selected) return;

      appliedSavedAddressRef.current = true;
      applySavedAddressToForm(selected);

      void setDefaultAddressRequest(id)
        .catch(() => {})
        .finally(() => {
          onDefaultChange?.();
        });
    },
    [addresses, applySavedAddressToForm, onDefaultChange],
  );

  return {
    savedAddressId,
    handleSavedAddressChange,
  };
}
