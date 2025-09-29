"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useLocation } from "@/app/[locale]/_components/useLocation";

import { countryStatesMap } from "../constants";
import { defaultData } from "../schema";
import { findCountryByCode, getUniqueCountries } from "../utils";

export function useAddressFields(prefix?: string) {
  const { watch, setValue, getValues, reset } = useFormContext();
  const { clearFormData } = useCheckoutStore((state) => state);
  const { handleCountrySelect } = useLocation();
  const { countryCode } = useTranslationsStore((state) => state.country);

  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const phoneFieldName = prefix ? `${prefix}.phone` : "phone";
  const selectedCountry = watch(countryFieldName);

  const uniqueCountries = getUniqueCountries();
  const phoneCodeItems = uniqueCountries
    .map((country) => ({
      label: `${country.name} +${country.phoneCode}`,
      value: `${country.countryCode}-${country.phoneCode}`,
      phoneCode: country.phoneCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] || [];

  useEffect(() => {
    const targetCountry = countryCode || selectedCountry;
    if (!targetCountry) return;

    const found = findCountryByCode(uniqueCountries, targetCountry);
    if (!found) return;

    const currentPhone = getValues(phoneFieldName) || "";
    if (!currentPhone || !/^\d/.test(currentPhone)) {
      setValue(phoneFieldName, found.phoneCode);
    }
  }, [
    countryCode,
    selectedCountry,
    phoneFieldName,
    uniqueCountries,
    getValues,
    setValue,
  ]);

  const handleCountryChange = (newCountryCode: string) => {
    clearFormData();

    reset({
      ...defaultData,
      country: newCountryCode,
    });

    const selectedCountry = findCountryByCode(uniqueCountries, newCountryCode);
    if (selectedCountry) {
      handleCountrySelect(selectedCountry);
    }
  };

  return {
    countries: uniqueCountries,
    phoneCodeItems,
    stateItems,
    handleCountryChange,
  };
}
