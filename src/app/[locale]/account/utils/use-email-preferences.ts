"use client";

import { EMAIL_PREFERENCES } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  findCountryByCode,
  getSortedCountries,
  getUniqueCountries,
} from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";
import type {
  AccountEmailPreference,
  AccountSchema,
} from "@/app/[locale]/account/utils/shema";
import {
  buildAccountUpdatePayload,
} from "@/app/[locale]/account/utils/utility";
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
  const [pending, setPending] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seededDefaultCountry = useRef(false);

  const shoppingPreference = useWatch({
    control: form.control,
    name: "shoppingPreference",
  });

  const preferenceItems = useMemo(
    () =>
      Object.entries(EMAIL_PREFERENCES).map(([label, value]) => ({
        label,
        value,
      })),
    [],
  );

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

  const performEmailSave = useCallback(async (): Promise<boolean> => {
    const data = form.getValues();
    setPending(true);
    try {
      const payload = buildAccountUpdatePayload(
        data,
        {
          languageId,
          currentCountryCode: currentCountry.countryCode,
        },
        "email",
      );
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await res.json().catch(() => null);
        return false;
      }
      return true;
    } finally {
      setPending(false);
    }
  }, [form, languageId, currentCountry.countryCode]);

  const persist = useCallback(async () => {
    const ok = await performEmailSave();
    if (ok) router.refresh();
  }, [performEmailSave, router]);

  const handleDefaultCountryPicked = useCallback(
    async (countryCode: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      const meta = findCountryByCode(uniqueCountries, countryCode);
      if (!meta) return;

      const ok = await performEmailSave();
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

  const commitShoppingPreference = useCallback(
    (value: AccountEmailPreference) => {
      form.setValue("shoppingPreference", value, {
        shouldValidate: true,
        shouldDirty: true,
      });
      scheduleSave();
    },
    [form, scheduleSave],
  );

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
    preferenceItems,
    shoppingPreference,
    sortedCountries,
    uniqueCountries,
    scheduleSave,
    commitShoppingPreference,
    onDefaultCountryChange: handleDefaultCountryPicked,
  };
}
