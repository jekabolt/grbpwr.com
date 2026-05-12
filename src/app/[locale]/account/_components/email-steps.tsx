import { useTranslations } from "next-intl";
import { type MouseEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";

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

  const onContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target = event.target as HTMLElement;
    if (target.closest("button,label,a,input,textarea,select")) return;

    form.setValue(name, !value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    onCommitted();
  };

  return (
    <div
      className={cn(
        "flex items-center border-b border-textInactiveColor py-6",
        !disabled && "cursor-pointer",
      )}
      onClick={onContainerClick}
    >
      <CheckboxField
        name={step.name}
        label={t(step.label)}
        description={t(step.description)}
        disabled={disabled}
        onCheckedChange={onCommitted}
        isEmailPreference
      />
    </div>
  );
}
