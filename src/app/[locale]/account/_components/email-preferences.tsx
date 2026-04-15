"use client";

import { Fragment } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { AccountSchema } from "@/app/[locale]/account/utils/shema";
import { EMAIL_REFERENCE_STEPS } from "@/app/[locale]/account/utils/utility";

import { useEmailPreferences } from "../utils/use-email-preferences";
import { UserLocation } from "./user-location";

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
    scheduleSave,
    commitShoppingPreference,
    onDefaultCountryChange,
  } = useEmailPreferences();

  const form = useFormContext<AccountSchema>();

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
        <div className="flex flex-col gap-6">
          <Text variant="uppercase">email preferences</Text>
          <div className="flex flex-wrap items-center uppercase">
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
        <UserLocation pending={pending} />
      </div>
    </div>
  );
}
