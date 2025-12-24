"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useLocation } from "@/app/[locale]/_components/useLocation";

import { countryStatesMap } from "../constants";
import { findCountryByCode, getUniqueCountries } from "../utils";

export function useAddressFields(prefix?: string) {
  const { watch, setValue, getValues } = useFormContext();
  const { countryCode } = useTranslationsStore((state) => state.currentCountry);
  const { nextCountry } = useTranslationsStore((state) => state);
  const { handleCountrySelect } = useLocation();
  const previousCountryRef = useRef<string | null>(null);

  const countryFieldName = prefix ? `${prefix}.country` : "country";
  const phoneFieldName = prefix ? `${prefix}.phone` : "phone";
  const selectedCountry = watch(countryFieldName);
  const isBillingAddress = prefix === "billingAddress";

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
      : countryCode || selectedCountry;
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
    isBillingAddress,
    getValues,
    setValue,
  ]);

  // Revert form country if UpdateLocation banner is cancelled
  useEffect(() => {
    if (isBillingAddress) return;

    // If nextCountry was cleared (banner cancelled), revert to previous country
    if (!nextCountry.countryCode && previousCountryRef.current) {
      setValue(countryFieldName, previousCountryRef.current, {
        shouldValidate: true,
      });
      previousCountryRef.current = null;
    }
  }, [nextCountry.countryCode, isBillingAddress, countryFieldName, setValue]);

  const handleCountryChange = (newCountryCode: string) => {
    const currentFormCountry = getValues(countryFieldName);

    // Don't do anything if the country hasn't actually changed
    if (currentFormCountry === newCountryCode) {
      return;
    }

    const selectedCountry = findCountryByCode(uniqueCountries, newCountryCode);
    if (!selectedCountry) return;

    if (isBillingAddress) {
      // For billing addresses, allow manual changes and update the form immediately
      setValue(countryFieldName, newCountryCode, { shouldValidate: true });

      // Update phone code if needed
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
      // For shipping addresses, update the form value so Select shows the selection
      // Store the previous country to revert if banner is cancelled
      previousCountryRef.current = currentFormCountry;
      setValue(countryFieldName, newCountryCode, { shouldValidate: true });

      // Show the UpdateLocation banner
      // If user accepts, page reloads with new country
      // If user cancels, we revert the form value in the useEffect above
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
