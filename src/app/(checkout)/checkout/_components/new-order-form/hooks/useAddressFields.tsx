"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { countries, countryStatesMap } from "../constants";

export function useAddressFields(prefix?: string) {
  const { watch, setValue } = useFormContext();
  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const phoneFieldName = prefix ? `${prefix}.phone` : "phone";

  const selectedCountry = watch(countryFieldName);
  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] || [];

  const phoneCodeMap = countries.reduce(
    (acc, c) => {
      if (!acc[c.phoneCode]) acc[c.phoneCode] = [];
      acc[c.phoneCode].push(c.label);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const phoneCodeItems = Object.entries(phoneCodeMap).map(
    ([code, country]) => ({
      label: `+${code} - ${country}`,
      value: code,
    }),
  );

  useEffect(() => {
    if (!selectedCountry) return;
    const found = countries.find((c) => c.value === selectedCountry);
    if (found) {
      setValue(phoneFieldName, found.phoneCode);
    }
  }, [selectedCountry, setValue, phoneFieldName]);

  return {
    phoneCodeItems,
    stateItems,
  };
}
