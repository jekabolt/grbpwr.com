"use client";

import { Fragment, useCallback } from "react";
import { currencySymbols } from "@/constants";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/ui/form/fields/select-field";
import { Text } from "@/components/ui/text";
import { findCountryByCode } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/utils";
import type { AccountSchema } from "@/app/[locale]/account/utils/shema";
import { EMAIL_REFERENCE_STEPS } from "@/app/[locale]/account/utils/utility";

import { useEmailPreferences } from "./use-email-preferences";

type EmailBooleanField = Pick<
  AccountSchema,
  "subscribeNewsletter" | "subscribeNewArrivals" | "subscribeEvents"
>;

type StepName = keyof EmailBooleanField;

function EmailPreferenceStepRow({
  step,
  disabled,
  onCommitted,
}: {
  step: (typeof EMAIL_REFERENCE_STEPS)[number];
  disabled: boolean;
  onCommitted: () => void;
}) {
  const form = useFormContext<AccountSchema>();
  const name = step.name as StepName;
  const value = useWatch({ control: form.control, name });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3 leading-none">
        <Text variant="uppercase">{step.label}</Text>
        <Text variant="inactive">{step.description}</Text>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {step.actions.map((action) => {
          const selected = value === action.value;
          return (
            <Button
              key={action.label}
              type="button"
              size="lg"
              disabled={disabled}
              className={cn(
                "border border-textColor bg-bgColor uppercase text-textColor",
                {
                  "bg-textColor text-bgColor": selected,
                },
              )}
              onClick={() => {
                form.setValue(name, action.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                onCommitted();
              }}
            >
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function EmailPreferences() {
  const {
    pending,
    preferenceItems,
    shoppingPreference,
    sortedCountries,
    uniqueCountries,
    scheduleSave,
    commitShoppingPreference,
    onDefaultCountryChange,
  } = useEmailPreferences();

  const renderDefaultCountryValue = useCallback(
    (
      selectedValue: string,
      selectedItem: { label: string; value: string } | undefined,
    ) => {
      if (!selectedItem) return null;
      const meta = findCountryByCode(uniqueCountries, selectedValue);
      const currency = meta?.currencyKey ?? "";
      return (
        <Text variant="uppercase">
          {selectedItem.label} /{" "}
          {currencySymbols[currency as keyof typeof currencySymbols]}
        </Text>
      );
    },
    [uniqueCountries],
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <Text variant="uppercase">email preferences</Text>
      <div className="flex flex-col gap-10">
        {EMAIL_REFERENCE_STEPS.map((step) => (
          <EmailPreferenceStepRow
            key={step.name}
            step={step}
            disabled={pending}
            onCommitted={scheduleSave}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3.5">
          <Text variant="uppercase">email preferences</Text>
          <div className="flex flex-wrap items-center uppercase leading-none">
            {preferenceItems.map((i, idx) => {
              const selected = shoppingPreference === i.value;
              return (
                <Fragment key={i.value}>
                  {idx > 0 && (
                    <Text className="mx-2 select-none text-textInactiveColor">
                      /
                    </Text>
                  )}
                  <Button
                    type="button"
                    disabled={pending}
                    variant={selected ? "underline" : "default"}
                    onClick={() => commitShoppingPreference(i.value)}
                    className={cn(
                      "uppercase text-textInactiveColor hover:text-textColor",
                      {
                        "text-textColor": selected,
                      },
                    )}
                  >
                    {i.label}
                  </Button>
                </Fragment>
              );
            })}
          </div>
        </div>

        <SelectField
          name="defaultCountry"
          label="COUNTRY"
          items={sortedCountries}
          variant="secondary"
          fullWidth
          disabled={pending}
          renderValue={renderDefaultCountryValue}
          onValueChange={onDefaultCountryChange}
        />
      </div>
    </div>
  );
}
