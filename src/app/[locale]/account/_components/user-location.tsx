import { useEffect, useRef } from "react";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import type { AccountSchema } from "../utils/schema";
import { useEmailPreferences } from "../utils/use-email-preferences";

export function UserLocationTrigger({
  pending,
  showLabel = true,
  onClick,
  showCurrentCountryText = false,
  buttonLabel,
}: {
  pending: boolean;
  showLabel?: boolean;
  onClick?: () => void;
  showCurrentCountryText?: boolean;
  buttonLabel?: string;
}) {
  const t = useTranslations("account");
  const { currentCountry, openCountryPopup } = useTranslationsStore((s) => s);
  const currencySymbol = currencySymbols[currentCountry.currencyKey || "EUR"];

  return (
    <div
      className={cn("space-y-6", {
        "flex gap-2 space-y-0": showCurrentCountryText,
      })}
    >
      {showLabel ? (
        <Text
          variant="uppercase"
          className={cn("mb-2 block", { "text-textInactiveColor": pending })}
        >
          {t("country")}
        </Text>
      ) : null}
      {showCurrentCountryText ? (
        <Text
          variant="uppercase"
          className={cn({ "text-textInactiveColor": pending })}
        >
          {t("you are in country: {country} / {currency}", {
            country: currentCountry.name,
            currency: currencySymbol,
          })}
        </Text>
      ) : null}
      <Button
        type="button"
        variant="underline"
        disabled={pending}
        className="uppercase"
        onClick={onClick ?? openCountryPopup}
      >
        {buttonLabel ?? `${currentCountry.name} / ${currencySymbol}`}
      </Button>
    </div>
  );
}

export function UserLocation({ pending }: { pending: boolean }) {
  const { onDefaultCountryChange } = useEmailPreferences();
  const { nextCountry, openCountryPopup, cancelNextCountry } =
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
    <UserLocationTrigger
      pending={pending}
      showLabel
      onClick={() => {
        countryPickerArmedRef.current = true;
        openCountryPopup();
      }}
    />
  );
}
