"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { countries, countryStatesMap } from "../constants";

export function useAddressFields(prefix?: string) {
  const { watch, setValue, getValues } = useFormContext();
  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const phoneFieldName = prefix ? `${prefix}.phone` : "phone";

  const selectedCountry = watch(countryFieldName);
  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] || [];

  const phoneCodeItems = countries
    .map((country) => ({
      label: `${country.label} +${country.phoneCode}`,
      value: `${country.value}-${country.phoneCode}`,
      phoneCode: country.phoneCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (!selectedCountry) return;
    const found = countries.find((c) => c.value === selectedCountry);
    if (found) {
      const currentPhone = getValues(phoneFieldName) || "";
      if (!currentPhone || !/^\d/.test(currentPhone)) {
        setValue(phoneFieldName, found.phoneCode);
      }
    }
  }, [selectedCountry, setValue, phoneFieldName, getValues]);

  return {
    phoneCodeItems,
    stateItems,
  };
}
