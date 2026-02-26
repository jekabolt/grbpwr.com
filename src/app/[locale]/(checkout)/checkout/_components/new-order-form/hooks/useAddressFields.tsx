"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { countryStatesMap } from "../constants";
import { findCountryByCode, getFieldName, getUniqueCountries } from "../utils";

export function useAddressFields(prefix?: string) {
  const { setValue, getValues } = useFormContext();
  const pathname = usePathname();
  const { setCurrentCountry, cancelNextCountry } =
    useTranslationsStore((s) => s);

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
    if (!selectedCountry) return;

    const found = findCountryByCode(uniqueCountries, selectedCountry);
    if (!found) return;

    const currentPhone = getValues(phoneFieldName) || "";
    if (!currentPhone || !/^\d/.test(currentPhone)) {
      setValue(phoneFieldName, found.phoneCode);
    }
  }, [
    selectedCountry,
    phoneFieldName,
    uniqueCountries,
    getValues,
    setValue,
  ]);

  const updatePhoneCode = (newCountryCode: string) => {
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
  };

  const handleCountryChange = (newCountryCode: string) => {
    const currentFormCountry = getValues(countryFieldName);

    if (currentFormCountry === newCountryCode) {
      return;
    }

    const country = findCountryByCode(uniqueCountries, newCountryCode);
    if (!country) return;

    setValue(countryFieldName, newCountryCode, { shouldValidate: true });
    updatePhoneCode(newCountryCode);

    if (!isBillingAddress) {
      cancelNextCountry();
      setCurrentCountry({
        name: country.name,
        countryCode: country.countryCode,
        currencyKey: country.currencyKey,
      });

      // Use country's default locale when changing country in checkout
      const newLocale = country.lng;
      const pathWithoutLocaleCountry =
        pathname.replace(
          /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/,
          "",
        ) || "/";
      window.location.href = `/${newCountryCode.toLowerCase()}/${newLocale}${pathWithoutLocaleCountry}`;
    }
  };

  return {
    countries: uniqueCountries,
    phoneCodeItems,
    stateItems,
    handleCountryChange,
  };
}
