"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { CHECKOUT_LOCATION_CHANGE_CANCELLED } from "@/lib/checkout-location-change";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { countryStatesMap } from "../constants";
import { findCountryByCode, getFieldName, getUniqueCountries } from "../utils";

const SHIPPING_FIELDS_TO_RESTORE = [
  "country",
  "state",
  "city",
  "address",
  "additionalAddress",
  "company",
  "phone",
  "postalCode",
  "savedAddressId",
] as const;

export function useAddressFields(prefix?: string) {
  const { setValue, getValues } = useFormContext();
  const { currentCountry, setNextCountry, cancelNextCountry } =
    useTranslationsStore((s) => s);

  const countryFieldName = getFieldName(prefix, "country");
  const phoneFieldName = getFieldName(prefix, "phone");
  const isBillingAddress = prefix === "billingAddress";
  const restoreSnapshotRef = useRef<Record<string, string> | null>(null);

  const selectedCountry = useWatch({ name: countryFieldName });

  const uniqueCountries = useMemo(() => getUniqueCountries(), []);

  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] || [];

  const updatePhoneCode = useCallback(
    (newCountryCode: string) => {
      const country = findCountryByCode(uniqueCountries, newCountryCode);
      if (!country) return;

      const currentPhone = getValues(phoneFieldName) || "";

      const countriesByPhoneCodeLength = [...uniqueCountries].sort(
        (a, b) => b.phoneCode.length - a.phoneCode.length,
      );

      let numberPart = currentPhone;
      for (const c of countriesByPhoneCodeLength) {
        if (currentPhone.startsWith(c.phoneCode)) {
          numberPart = currentPhone.slice(c.phoneCode.length);
          break;
        }
      }

      const newPhoneValue =
        numberPart && numberPart !== currentPhone
          ? country.phoneCode + numberPart
          : country.phoneCode;
      setValue(phoneFieldName, newPhoneValue);
    },
    [getValues, phoneFieldName, setValue, uniqueCountries],
  );

  useEffect(() => {
    if (!selectedCountry) return;

    const found = findCountryByCode(uniqueCountries, selectedCountry);
    if (!found) return;

    const currentPhone = getValues(phoneFieldName) || "";
    const phoneMatchesCountry = currentPhone.startsWith(found.phoneCode);
    if (!currentPhone || !phoneMatchesCountry) {
      updatePhoneCode(selectedCountry);
    }
  }, [selectedCountry, phoneFieldName, uniqueCountries, getValues, updatePhoneCode]);

  useEffect(() => {
    if (isBillingAddress) return;

    function restorePreviousShippingCountry() {
      const snapshot = restoreSnapshotRef.current;
      if (!snapshot) return;

      SHIPPING_FIELDS_TO_RESTORE.forEach((field) => {
        setValue(field, snapshot[field] ?? "", {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
      restoreSnapshotRef.current = null;
    }

    window.addEventListener(
      CHECKOUT_LOCATION_CHANGE_CANCELLED,
      restorePreviousShippingCountry,
    );
    return () => {
      window.removeEventListener(
        CHECKOUT_LOCATION_CHANGE_CANCELLED,
        restorePreviousShippingCountry,
      );
    };
  }, [isBillingAddress, setValue]);

  const handleCountryChange = (newCountryCode: string) => {
    const country = findCountryByCode(uniqueCountries, newCountryCode);
    if (!country) return;

    if (
      !isBillingAddress &&
      country.countryCode.toLowerCase() !==
        currentCountry.countryCode?.toLowerCase() &&
      !restoreSnapshotRef.current
    ) {
      const values = getValues();
      restoreSnapshotRef.current = Object.fromEntries(
        SHIPPING_FIELDS_TO_RESTORE.map((field) => [
          field,
          String(
            field === "country" ? (selectedCountry ?? "") : (values[field] ?? ""),
          ),
        ]),
      );
    }

    setValue(countryFieldName, newCountryCode, { shouldValidate: true });
    updatePhoneCode(newCountryCode);

    if (isBillingAddress) {
      setValue(getFieldName(prefix, "state"), "", { shouldValidate: false });
      setValue(getFieldName(prefix, "city"), "", { shouldValidate: false });
    }

    if (!isBillingAddress) {
      if (
        country.countryCode.toLowerCase() ===
        currentCountry.countryCode?.toLowerCase()
      ) {
        cancelNextCountry();
        restoreSnapshotRef.current = null;
        return;
      }

      setNextCountry({
        name: country.name,
        countryCode: country.countryCode,
        currencyKey: country.currencyKey,
        localeCode: country.lng,
      });
    }
  };

  return {
    countries: uniqueCountries,
    stateItems,
    handleCountryChange,
  };
}
