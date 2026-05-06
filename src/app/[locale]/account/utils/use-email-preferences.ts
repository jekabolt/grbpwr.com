"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";

import {
  findCountryByCode,
  getSortedCountries,
  getUniqueCountries,
} from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";
import type {
  AccountSchema
} from "@/app/[locale]/account/utils/schema";
import { useAccountUpdate } from "@/app/[locale]/account/utils/use-account-update";
import { navigateToCountryWithPicker } from "@/lib/navigation/navigate-to-country-with-picker";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

const SAVE_DEBOUNCE_MS = 450;

export function useEmailPreferences() {
  const router = useRouter();
  const pathname = usePathname();
  const form = useFormContext<AccountSchema>();
  const {
    currentCountry,
    languageId,
    cancelNextCountry,
    setCurrentCountry,
  } = useTranslationsStore((s) => s);
  const { pending, toastOpen, toastMessage, setToastOpen, updateAccount } =
    useAccountUpdate();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seededDefaultCountry = useRef(false);

  const sortedCountries = useMemo(() => getSortedCountries(), []);
  const uniqueCountries = useMemo(() => getUniqueCountries(), []);

  useEffect(() => {
    // Keep `defaultCountry` aligned with cookie-derived `currentCountry`
    // unless the user explicitly changed the field.
    const cc = currentCountry.countryCode?.trim().toUpperCase();
    if (!cc) return;

    if (!seededDefaultCountry.current) {
      form.setValue("defaultCountry", cc, {
        shouldDirty: false,
        shouldValidate: false,
      });
      seededDefaultCountry.current = true;
      return;
    }

    const dirty = !!form.formState.dirtyFields?.defaultCountry;
    if (!dirty) {
      form.setValue("defaultCountry", cc, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [form, currentCountry.countryCode]);

  const performEmailSave = useCallback(async (refresh = true): Promise<boolean> => {
    const data = form.getValues();
    const result = await updateAccount({
      data,
      context: {
        languageId,
        currentCountryCode: currentCountry.countryCode,
      },
      mode: "email",
      refresh,
    });
    return result.ok;
  }, [form, languageId, currentCountry.countryCode, updateAccount]);

  const persist = useCallback(async () => {
    await performEmailSave(true);
  }, [performEmailSave]);

  const handleDefaultCountryPicked = useCallback(
    async (countryCode: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      const meta = findCountryByCode(uniqueCountries, countryCode);
      if (!meta) return;

      const ok = await performEmailSave(false);
      if (!ok) return;

      if (
        countryCode.toLowerCase() === currentCountry.countryCode?.toLowerCase()
      ) {
        await router.refresh();
        return;
      }

      navigateToCountryWithPicker(meta, {
        pathname,
        cancelNextCountry,
        setCurrentCountry,
        extraSearchParams: { account_panel: "email" },
      });
    },
    [
      uniqueCountries,
      performEmailSave,
      currentCountry.countryCode,
      pathname,
      cancelNextCountry,
      setCurrentCountry,
      router,
    ],
  );

  const scheduleSave = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      void persist();
    }, SAVE_DEBOUNCE_MS);
  }, [persist]);


  useEffect(
    () => () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    },
    [],
  );

  return {
    pending,
    toastOpen,
    toastMessage,
    setToastOpen,
    sortedCountries,
    uniqueCountries,
    scheduleSave,
    onDefaultCountryChange: handleDefaultCountryPicked,
  };
}
