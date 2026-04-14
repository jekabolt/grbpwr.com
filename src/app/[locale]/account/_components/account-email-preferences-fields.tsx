"use client";

import { Fragment, useMemo } from "react";
import { EMAIL_PREFERENCES } from "@/constants";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import { Text } from "@/components/ui/text";
import { AccountSchema } from "@/app/[locale]/account/utils/shema";

type Props = {
  form: UseFormReturn<AccountSchema>;
  disabled?: boolean;
};

export function AccountEmailPreferencesFields({ form, disabled }: Props) {
  const preferenceRadioItems = useMemo(
    () =>
      Object.entries(EMAIL_PREFERENCES).map(([label, value]) => ({
        label,
        value,
      })),
    [],
  );

  const subscribeNewArrivals = useWatch({
    control: form.control,
    name: "subscribeNewArrivals",
  });

  const shoppingPreference = useWatch({
    control: form.control,
    name: "shoppingPreference",
  });

  return (
    <div className="flex gap-6 uppercase leading-none">
      <CheckboxField
        name="subscribeNewArrivals"
        disabled={disabled}
        label={
          subscribeNewArrivals
            ? "email preferences"
            : "receive updates on new arrivals and brand news"
        }
      />
      {subscribeNewArrivals ? (
        <div className="flex items-center uppercase">
          {preferenceRadioItems.map((i, idx) => {
            const selected = shoppingPreference === i.value;
            return (
              <Fragment key={i.value}>
                {idx > 0 ? (
                  <Text className="mx-2 select-none text-textInactiveColor">
                    /
                  </Text>
                ) : null}
                <Button
                  type="button"
                  disabled={disabled}
                  variant={selected ? "underline" : "default"}
                  onClick={() =>
                    form.setValue("shoppingPreference", i.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={
                    selected
                      ? "h-auto min-h-0 p-0 uppercase"
                      : "h-auto min-h-0 p-0 uppercase text-textInactiveColor hover:text-textColor"
                  }
                >
                  {i.label}
                </Button>
              </Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
