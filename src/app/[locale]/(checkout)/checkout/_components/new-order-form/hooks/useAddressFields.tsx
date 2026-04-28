"use client";

import { useEffect } from "react";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { useFormContext, useWatch } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { countryStatesMap } from "../constants";
import { findCountryByCode, getFieldName, getUniqueCountries } from "../utils";

export function useAddressFields(prefix?: string) {
  const { setValue, getValues } = useFormContext();
  const { currentCountry, setLanguageId, setNextCountry, cancelNextCountry } =
    useTranslationsStore((s) => s);

  const countryFieldName = getFieldName(prefix, "country");
  const phoneFieldName = getFieldName(prefix, "phone");
  const isBillingAddress = prefix === "billingAddress";

  const selectedCountry = useWatch({ name: countryFieldName });

  const uniqueCountries = getUniqueCountries();

  const stateItems =
    countryStatesMap[selectedCountry as keyof typeof countryStatesMap] || [];

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

  useEffect(() => {
    if (!selectedCountry) return;

    const found = findCountryByCode(uniqueCountries, selectedCountry);
    if (!found) return;

    const currentPhone = getValues(phoneFieldName) || "";
    const phoneMatchesCountry = currentPhone.startsWith(found.phoneCode);
    if (!currentPhone || !phoneMatchesCountry) {
      updatePhoneCode(selectedCountry);
    }
  }, [selectedCountry, phoneFieldName, uniqueCountries, getValues, setValue]);

  const handleCountryChange = (newCountryCode: string) => {
    const country = findCountryByCode(uniqueCountries, newCountryCode);
    if (!country) return;

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
        return;
      }

      setNextCountry({
        name: country.name,
        countryCode: country.countryCode,
        currencyKey: country.currencyKey,
        localeCode: country.lng,
      });

      const languageId = LANGUAGE_CODE_TO_ID[country.lng];
      if (languageId !== undefined) {
        setLanguageId(languageId);
      }
    }
  };

  return {
    countries: uniqueCountries,
    stateItems,
    handleCountryChange,
  };
}
