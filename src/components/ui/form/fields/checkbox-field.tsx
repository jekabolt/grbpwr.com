import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";

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
          <div
            className={cn("flex items-start gap-x-4 leading-none", {
              "cursor-pointer items-center": isEmailPreference,
              "items-center": !description && !isEmailPreference,
            })}
            onClick={(event) => {
              if (!isEmailPreference || props.disabled || props.loading) return;
              const target = event.target as HTMLElement;
              if (target.closest("button,label,a,input,textarea,select"))
                return;
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
              className={cn("", props.className, {
                "text-textInactiveColor": props.disabled || props.loading,
                "space-y-1": description,
                "space-y-3": isEmailPreference,
              })}
            >
              <FormLabel
                className={cn("", {
                  uppercase: isEmailPreference,
                  "flex min-h-11 items-center": !description && !isEmailPreference,
                })}
              >
                <Text className="leading-none">{label}</Text>
              </FormLabel>
              <FormDescription
                className={cn("leading-none", {
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
