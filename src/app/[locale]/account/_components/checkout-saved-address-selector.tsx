"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { AddressesSection } from "../sections/addresses";
import { useAddresses } from "../utils/useAddresses";
import { AddressesSelector } from "./addresses-selector";

export function CheckoutSavedAddressSelector({
  loading,
  disabled,
  isSignedIn,
  refreshKey,
  account,
  defaultOnly,
  onDefaultChange,
  onAddNewAddress,
}: {
  loading: boolean;
  disabled?: boolean;
  isSignedIn: boolean;
  refreshKey?: number;
  account: StorefrontAccount;
  defaultOnly?: boolean;
  onDefaultChange?: () => void;
  onAddNewAddress?: () => void;
}) {
  const { watch, setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);

  const savedAddressId = watch("savedAddressId") as string | undefined;

  const { pending, addresses, defaultAddress } = useAddresses({
    enabled: isSignedIn,
    refreshKey,
  });

  const appliedSavedAddressRef = useRef(false);

  const applySavedAddressToForm = useCallback(
    (addr: StorefrontSavedAddress) => {
      if (!addr) return;

      const idStr = addr.id != null ? String(addr.id) : "";
      setValue("savedAddressId", idStr, { shouldValidate: false });

      setValue("country", (addr.country ?? "").trim().toLowerCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("state", (addr.state ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("city", (addr.city ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("address", (addr.addressLineOne ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("additionalAddress", (addr.addressLineTwo ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("company", (addr.company ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("postalCode", (addr.postalCode ?? "").trim(), {
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
        (a) => String(a.id ?? "") === savedAddressId,
      );
      if (selected) applySavedAddressToForm(selected);
    }

    appliedSavedAddressRef.current = true;
  }, [
    applySavedAddressToForm,
    addresses,
    defaultAddress,
    getValues,
    isSignedIn,
    savedAddressId,
    setValue,
  ]);

  const isDisabled = disabled || pending || loading || !addresses.length;

  const selectedAddress = addresses.find(
    (a) => String(a.id ?? "") === savedAddressId,
  );

  const handleValueChange = (value: string) => {
    const id = Number(value);
    if (!Number.isFinite(id)) return;
    const selected = addresses.find((a) => a.id === id);
    if (!selected) return;
    appliedSavedAddressRef.current = true;
    applySavedAddressToForm(selected);
    void fetch(`/api/account/addresses/${id}/default`, {
      method: "POST",
    })
      .catch(() => {})
      .finally(() => {
        onDefaultChange?.();
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <AddressesSection
        account={account}
        defaultOnly={defaultOnly}
        refreshKey={refreshKey}
      />
      <div className="flex items-end justify-between">
        <Button
          type="button"
          variant="underline"
          className="uppercase"
          onClick={onAddNewAddress}
          disabled={disabled || loading}
        >
          + add new address
        </Button>
        <div className="w-64">
          <AddressesSelector
            savedAddressId={savedAddressId || ""}
            handleValueChange={handleValueChange}
            open={open}
            setOpen={setOpen}
            isDisabled={isDisabled}
            selectedAddress={selectedAddress}
            addresses={addresses}
            account={account}
          />
        </div>
      </div>
    </div>
  );
}
