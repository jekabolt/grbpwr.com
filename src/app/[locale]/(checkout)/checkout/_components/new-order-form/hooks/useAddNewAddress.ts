"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { addAddressRequest } from "@/app/[locale]/account/utils/address-actions";

const FIELDS_TO_VALIDATE = [
  "firstName",
  "lastName",
  "country",
  "state",
  "city",
  "address",
  "additionalAddress",
  "company",
  "phone",
  "postalCode",
] as const;

type Params = {
  defaultCountryCode?: string;
  onSaved: () => void;
};

export function useAddNewAddress({ defaultCountryCode, onSaved }: Params) {
  const { setValue, getValues, trigger } = useFormContext();
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [savingNewAddress, setSavingNewAddress] = useState(false);
  const [saveAddressError, setSaveAddressError] = useState<string | null>(null);
  const previousAddressValuesRef = useRef<
    Record<
      | "firstName"
      | "lastName"
      | "country"
      | "state"
      | "city"
      | "address"
      | "additionalAddress"
      | "company"
      | "phone"
      | "postalCode"
      | "savedAddressId",
      string
    > | null
  >(null);

  function resetAddressFields() {
    const keys: Array<
      | "state"
      | "city"
      | "address"
      | "additionalAddress"
      | "company"
      | "phone"
      | "postalCode"
      | "savedAddressId"
    > = [
      "state",
      "city",
      "address",
      "additionalAddress",
      "company",
      "phone",
      "postalCode",
      "savedAddressId",
    ];
    keys.forEach((k) =>
      setValue(k, "", { shouldValidate: false, shouldDirty: false }),
    );
    setValue("country", defaultCountryCode ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
  }

  function handleAddNewAddress() {
    setSaveAddressError(null);
    const currentValues = getValues();
    previousAddressValuesRef.current = {
      firstName: String(currentValues.firstName ?? ""),
      lastName: String(currentValues.lastName ?? ""),
      country: String(currentValues.country ?? ""),
      state: String(currentValues.state ?? ""),
      city: String(currentValues.city ?? ""),
      address: String(currentValues.address ?? ""),
      additionalAddress: String(currentValues.additionalAddress ?? ""),
      company: String(currentValues.company ?? ""),
      phone: String(currentValues.phone ?? ""),
      postalCode: String(currentValues.postalCode ?? ""),
      savedAddressId: String(currentValues.savedAddressId ?? ""),
    };
    resetAddressFields();
    setIsAddingNewAddress(true);
  }

  function handleCancelAddNewAddress() {
    setSaveAddressError(null);
    const previousValues = previousAddressValuesRef.current;
    if (previousValues) {
      Object.entries(previousValues).forEach(([key, value]) => {
        setValue(key as keyof typeof previousValues, value, {
          shouldValidate: false,
          shouldDirty: false,
        });
      });
      previousAddressValuesRef.current = null;
      void trigger([...FIELDS_TO_VALIDATE, "savedAddressId"]);
    }
    setIsAddingNewAddress(false);
  }

  async function handleSaveNewAddress() {
    setSaveAddressError(null);
    const valid = await trigger([...FIELDS_TO_VALIDATE]);
    if (!valid) return;

    const values = getValues();
    setSavingNewAddress(true);
    try {
      const result = await addAddressRequest({
        country: String(values.country ?? "").trim().toLowerCase(),
        state: String(values.state ?? "").trim(),
        city: String(values.city ?? "").trim(),
        addressLineOne: String(values.address ?? "").trim(),
        addressLineTwo: String(values.additionalAddress ?? "").trim(),
        company: String(values.company ?? "").trim(),
        postalCode: String(values.postalCode ?? "").trim(),
        phone: String(values.phone ?? "").trim(),
        isDefault: true,
      });

      if (!result.ok) {
        setSaveAddressError(result.error);
        return;
      }

      if (result.addressId) {
        setValue("savedAddressId", result.addressId, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
      previousAddressValuesRef.current = null;
      onSaved();
      setIsAddingNewAddress(false);
    } catch {
      setSaveAddressError("failed to add address");
    } finally {
      setSavingNewAddress(false);
    }
  }

  return {
    isAddingNewAddress,
    savingNewAddress,
    saveAddressError,
    handleAddNewAddress,
    handleCancelAddNewAddress,
    handleSaveNewAddress,
  };
}
