import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AccountPersonalInfoFields } from "@/app/[locale]/account/_components/personal-info-fields";
import type { AccountSchema } from "@/app/[locale]/account/utils/shema";

import { buildAccountUpdatePayload } from "../utils/utility";

export function PersonalInfo({
  selectedCountryCode,
}: {
  selectedCountryCode: string;
}) {
  const router = useRouter();
  const form = useFormContext<AccountSchema>();
  const [pending, setPending] = useState(false);
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  async function onSubmit(data: AccountSchema) {
    setPending(true);
    try {
      const payload = buildAccountUpdatePayload(
        data,
        {
          languageId,
          currentCountryCode: currentCountry.countryCode,
        },
        "personal",
      );
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await res.json().catch(() => null);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-14"
    >
      <Text variant="uppercase">personal info</Text>
      <AccountPersonalInfoFields
        twoColumn
        disabled={pending}
        selectedCountryCode={selectedCountryCode}
      />
      <Button
        type="submit"
        variant="main"
        size="lg"
        className="uppercase"
        loading={pending}
        disabled={pending}
      >
        save changes
      </Button>
    </form>
  );
}
