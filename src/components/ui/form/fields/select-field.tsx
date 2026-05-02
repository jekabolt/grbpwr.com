import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "..";
import Select from "../../select";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  hideFormMessage?: boolean;
  items: { label: string; value: string }[];
  renderValue?: (
    selectedValue: string,
    selectedItem: { label: string; value: string } | undefined,
  ) => ReactNode;
  onValueChange?: (value: string) => void;
  [k: string]: any;
};

export default function SelectField({
  loading,
  items,
  name,
  label,
  className,
  disabled,
  hideFormMessage,
  renderValue,
  onValueChange: onValueChangeSideEffect,
  ...props
}: Props) {
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
          {label && (
            <FormLabel className={disabled ? "text-textInactiveColor" : ""}>
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={(v: string) => {
              field.onChange(v);
              onValueChangeSideEffect?.(v);
            }}
            items={items}
            renderValue={renderValue}
            {...field}
            {...props}
            className={className}
            disabled={loading || disabled}
            onBlur={onBlur}
          />
          {!hideFormMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
