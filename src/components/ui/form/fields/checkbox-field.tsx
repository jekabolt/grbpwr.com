import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = {
  name: string;
  label: string | React.ReactNode;
  description?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  isEmailPreference?: boolean;
  [k: string]: any;
};

export default function CheckboxField({
  label,
  name,
  description,
  onCheckedChange,
  className,
  isEmailPreference,
  ...props
}: Props) {
  const t = useTranslations("errors");
  const { control, trigger } = useFormContext();

  function onBlur() {
    trigger(name);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/*
            Make the full row tappable for email preferences while avoiding
            double-toggle when clicking native interactive elements.
          */}
          <div
            className={cn("flex items-start gap-x-4", {
              "cursor-pointer items-center": isEmailPreference,
            })}
            onClick={(event) => {
              if (!isEmailPreference || props.disabled || props.loading) return;
              const target = event.target as HTMLElement;
              if (target.closest("button,label,a,input,textarea,select")) return;
              field.onChange(!field.value);
              onCheckedChange?.(!field.value);
            }}
          >
            <FormControl>
              <Checkbox
                {...field}
                checked={field.value}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  field.onChange(checked);
                  onCheckedChange?.(checked);
                }}
                disabled={props.disabled || props.loading}
                onBlur={onBlur}
                {...props}
              />
            </FormControl>
            <div
              className={cn("leading-none", props.className, {
                "text-textInactiveColor": props.disabled || props.loading,
                "space-y-1": description,
                "space-y-3": isEmailPreference,
              })}
            >
              <FormLabel
                className={cn("", {
                  uppercase: isEmailPreference,
                })}
              >
                {label}
              </FormLabel>
              <FormDescription
                className={cn("", {
                  lowercase: isEmailPreference,
                })}
              >
                {description}
              </FormDescription>
            </div>
          </div>
          <FormMessage translateError={t} fieldName={name} />
        </FormItem>
      )}
    />
  );
}
