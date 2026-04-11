"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import type { StorefrontAccount } from "@/api/proto-http/frontend";
import {
  findCountryByCode,
  getUniqueCountries,
} from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PhoneField } from "@/components/ui/form/fields/phone-field";
import { Text } from "@/components/ui/text";
import { errorMessages } from "@/constants";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

const accountPhoneSchema = z.object({
  phone: z
    .string()
    .min(5, errorMessages.phone.min)
    .max(15, errorMessages.phone.max)
    .trim(),
});

type AccountPhoneForm = z.infer<typeof accountPhoneSchema>;

type Props = {
  account: StorefrontAccount;
  onSaved?: () => void;
  onSkipped?: () => void;
};

function defaultPhoneFromCountry(
  account: StorefrontAccount,
  shopCountryCode: string | undefined,
): string {
  const existing = account.phone?.trim();
  if (existing) return existing;

  const countryCode =
    account.defaultCountry?.trim() || shopCountryCode?.trim() || "";
  if (!countryCode) return "";

  const country = findCountryByCode(getUniqueCountries(), countryCode);
  return country?.phoneCode ?? "";
}

export function AccountPhonePrompt({ account, onSaved, onSkipped }: Props) {
  const router = useRouter();
  const t = useTranslations("checkout");
  const shopCountryCode = useTranslationsStore((s) => s.currentCountry?.countryCode);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const phoneCodeItems = useMemo(
    () =>
      getUniqueCountries()
        .map((country) => ({
          label: `${country.name} +${country.phoneCode}`,
          value: `${country.countryCode}-${country.phoneCode}`,
          phoneCode: country.phoneCode,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  const selectedCountryCode =
    account.defaultCountry?.trim() || shopCountryCode?.trim() || undefined;

  const initialPhone = useMemo(
    () => defaultPhoneFromCountry(account, shopCountryCode),
    [account, shopCountryCode],
  );

  const form = useForm<AccountPhoneForm>({
    resolver: zodResolver(accountPhoneSchema),
    defaultValues: {
      phone: initialPhone,
    },
  });

  async function onSubmit(values: AccountPhoneForm) {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: values.phone }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "could not save phone");
        return;
      }
      onSaved?.();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Text variant="uppercase" className="text-center">
        phone number
      </Text>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <PhoneField
            name="phone"
            label={t("phone number:")}
            items={phoneCodeItems}
            selectedCountry={selectedCountryCode}
          />
          <div className="flex w-full gap-4">
            <Button
              type="button"
              variant="simpleReverse"
              size="lg"
              className="w-full border border-textColor"
              disabled={pending}
              onClick={() => onSkipped?.()}
            >
              skip for now
            </Button>
            <Button type="submit" variant="main" size="lg" className="w-full" disabled={pending}>
              save
            </Button>
          </div>
        </form>
      </Form>
      {error ? (
        <Text variant="uppercase" className="text-center text-red-600">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
