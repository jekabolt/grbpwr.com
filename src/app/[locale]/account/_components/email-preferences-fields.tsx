"use client";

import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import { AccountSchema } from "@/app/[locale]/account/utils/shema";

import { NewArrivales } from "./new-arrivals";

type Props = {
  form: UseFormReturn<AccountSchema>;
  disabled?: boolean;
};

export function AccountEmailPreferencesFields({ form, disabled }: Props) {
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
        <NewArrivales
          pending={disabled}
          value={shoppingPreference}
          onChange={(next) => {
            form.setValue("shoppingPreference", next, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      ) : null}
    </div>
  );
}
