import { useEffect, useRef } from "react";
import { currencySymbols } from "@/constants";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import type { AccountSchema } from "../utils/shema";
import { useEmailPreferences } from "../utils/use-email-preferences";

export function UserLocation({ pending }: { pending: boolean }) {
  const { onDefaultCountryChange } = useEmailPreferences();
  const { currentCountry, nextCountry, openCountryPopup, cancelNextCountry } =
    useTranslationsStore((s) => s);
  const countryPickerArmedRef = useRef(false);
  const form = useFormContext<AccountSchema>();

  useEffect(() => {
    if (!countryPickerArmedRef.current) return;
    if (!nextCountry?.countryCode) return;

    const code = nextCountry.countryCode.toUpperCase();
    countryPickerArmedRef.current = false;

    onDefaultCountryChange(code);

    form.setValue("defaultCountry", code, {
      shouldDirty: true,
      shouldValidate: true,
    });
    cancelNextCountry();
  }, [
    cancelNextCountry,
    form,
    nextCountry?.countryCode,
    onDefaultCountryChange,
  ]);

  return (
    <div className="space-y-6">
      <Text
        variant="uppercase"
        className={cn("mb-2 block", { "text-textInactiveColor": pending })}
      >
        COUNTRY
      </Text>
      <Button
        type="button"
        disabled={pending}
        className="uppercase"
        onClick={() => {
          countryPickerArmedRef.current = true;
          openCountryPopup();
        }}
      >
        {currentCountry.name} /{" "}
        {currencySymbols[currentCountry.currencyKey || "EUR"]}
      </Button>
    </div>
  );
}
