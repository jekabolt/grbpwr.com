import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import { Text } from "@/components/ui/text";

import { AccountSchema } from "../utils/schema";
import { EMAIL_REFERENCE_STEPS } from "../utils/utility";

type EmailBooleanField = Pick<
  AccountSchema,
  "subscribeNewsletter" | "subscribeNewArrivals" | "subscribeEvents"
>;

type StepName = keyof EmailBooleanField;

export function EmailPreferenceStepRow({
  step,
  disabled,
  onCommitted,
}: {
  step: (typeof EMAIL_REFERENCE_STEPS)[number];
  disabled: boolean;
  onCommitted: () => void;
}) {
  const t = useTranslations("account");
  const form = useFormContext<AccountSchema>();
  const name = step.name as StepName;
  const value = useWatch({ control: form.control, name });

  return (
    <>
      <div className="block lg:hidden">
        <MobileEmailPreferenceStepRow
          step={step}
          disabled={disabled}
          onCommitted={onCommitted}
        />
      </div>
      <div className="hidden flex-col gap-6 lg:flex">
        <div className="space-y-3 leading-none">
          <Text variant="uppercase">{t(step.label)}</Text>
          <Text variant="inactive">{t(step.description)}</Text>
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
                {t(action.label)}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function MobileEmailPreferenceStepRow({
  step,
  disabled,
  onCommitted,
}: {
  step: (typeof EMAIL_REFERENCE_STEPS)[number];
  disabled: boolean;
  onCommitted: () => void;
}) {
  const t = useTranslations("account");
  return (
    <div className="flex items-center border-b border-textInactiveColor py-6">
      <CheckboxField
        name={step.name}
        label={t(step.label)}
        description={t(step.description)}
        disabled={disabled}
        onCheckedChange={onCommitted}
        isEmailPreference
      />
      {/* <div className="flex flex-col gap-3">
        <Text variant="uppercase">{t(step.label)}</Text>
        <Text>{t(step.description)}</Text>
      </div> */}
    </div>
  );
}
