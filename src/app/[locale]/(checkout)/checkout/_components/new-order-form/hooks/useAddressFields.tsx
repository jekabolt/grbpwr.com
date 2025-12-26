"use client";

import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useLocation } from "@/app/[locale]/_components/useLocation";

import { countryStatesMap } from "../constants";
import { findCountryByCode, getFieldName, getUniqueCountries } from "../utils";

export function useAddressFields(prefix?: string) {
  const { setValue, getValues } = useFormContext();
  const { currentCountry, nextCountry } = useTranslationsStore((s) => s);
  const { handleCountrySelect } = useLocation();

  const previousCountryRef = useRef<string | null>(null);
  const countryFieldName = getFieldName(prefix, "country");
  const phoneFieldName = getFieldName(prefix, "phone");
  const isBillingAddress = prefix === "billingAddress";

  const selectedCountry = useWatch({ name: countryFieldName });

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
    const targetCountry = isBillingAddress
      ? selectedCountry
      : currentCountry.countryCode || selectedCountry;
    if (!targetCountry) return;

    const found = findCountryByCode(uniqueCountries, targetCountry);
    if (!found) return;

    const currentPhone = getValues(phoneFieldName) || "";
    if (!currentPhone || !/^\d/.test(currentPhone)) {
      setValue(phoneFieldName, found.phoneCode);
    }
  }, [
    currentCountry.countryCode,
    selectedCountry,
    phoneFieldName,
    uniqueCountries,
    isBillingAddress,
    getValues,
    setValue,
  ]);

  useEffect(() => {
    if (isBillingAddress) return;

    if (!nextCountry.countryCode && previousCountryRef.current) {
      setValue(countryFieldName, previousCountryRef.current, {
        shouldValidate: true,
      });
      previousCountryRef.current = null;
    }
  }, [nextCountry.countryCode, isBillingAddress, countryFieldName, setValue]);

  const handleCountryChange = (newCountryCode: string) => {
    const currentFormCountry = getValues(countryFieldName);

    if (currentFormCountry === newCountryCode) {
      return;
    }

    const selectedCountry = findCountryByCode(uniqueCountries, newCountryCode);
    if (!selectedCountry) return;

    if (isBillingAddress) {
      setValue(countryFieldName, newCountryCode, { shouldValidate: true });

      const currentPhone = getValues(phoneFieldName) || "";

      const countriesByPhoneCodeLength = [...uniqueCountries].sort(
        (a, b) => b.phoneCode.length - a.phoneCode.length,
      );

      let numberPart = currentPhone;
      for (const country of countriesByPhoneCodeLength) {
        if (currentPhone.startsWith(country.phoneCode)) {
          numberPart = currentPhone.slice(country.phoneCode.length);
          break;
        }
      }

      const newPhoneValue =
        numberPart && numberPart !== currentPhone
          ? selectedCountry.phoneCode + numberPart
          : selectedCountry.phoneCode;
      setValue(phoneFieldName, newPhoneValue);
    } else {
      previousCountryRef.current = currentFormCountry;
      setValue(countryFieldName, newCountryCode, { shouldValidate: true });
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
