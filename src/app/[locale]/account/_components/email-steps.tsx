import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { AccountSchema } from "../utils/shema";
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
