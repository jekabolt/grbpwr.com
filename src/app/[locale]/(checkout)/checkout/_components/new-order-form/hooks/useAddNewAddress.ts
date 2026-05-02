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

type AddNewAddressOptions = {
  saveOnly?: boolean;
};

export function useAddNewAddress({ defaultCountryCode, onSaved }: Params) {
  const { setValue, getValues, trigger, resetField } = useFormContext();
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [savingNewAddress, setSavingNewAddress] = useState(false);
  const [saveAddressError, setSaveAddressError] = useState<string | null>(null);
  const [showSaveOnlyActions, setShowSaveOnlyActions] = useState(false);
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

  function handleAddNewAddress(options?: AddNewAddressOptions) {
    setSaveAddressError(null);
    setShowSaveOnlyActions(!!options?.saveOnly);
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
    setShowSaveOnlyActions(false);
    const previousValues = previousAddressValuesRef.current;
    if (previousValues) {
      resetField("firstName", { defaultValue: previousValues.firstName });
      resetField("lastName", { defaultValue: previousValues.lastName });
      resetField("country", { defaultValue: previousValues.country });
      resetField("state", { defaultValue: previousValues.state });
      resetField("city", { defaultValue: previousValues.city });
      resetField("address", { defaultValue: previousValues.address });
      resetField("additionalAddress", {
        defaultValue: previousValues.additionalAddress,
      });
      resetField("company", { defaultValue: previousValues.company });
      resetField("phone", { defaultValue: previousValues.phone });
      resetField("postalCode", { defaultValue: previousValues.postalCode });
      resetField("savedAddressId", { defaultValue: previousValues.savedAddressId });
      previousAddressValuesRef.current = null;
    }
    setIsAddingNewAddress(false);
  }

  function touchAddressFields() {
    const values = getValues();
    FIELDS_TO_VALIDATE.forEach((field) => {
      setValue(field, values[field] ?? "", {
        shouldTouch: true,
        shouldDirty: false,
        shouldValidate: false,
      });
    });
  }

  async function handleSaveNewAddress() {
    setSaveAddressError(null);
    touchAddressFields();
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
      setShowSaveOnlyActions(false);
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
    showSaveOnlyActions,
    handleAddNewAddress,
    handleCancelAddNewAddress,
    handleSaveNewAddress,
  };
}
