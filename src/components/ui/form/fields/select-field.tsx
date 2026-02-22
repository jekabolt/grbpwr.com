import { useFormContext } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "..";
import Select from "../../select";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  items: {
    label: string;
    value: string;
  }[];
  [k: string]: any;
};

export default function SelectField({
  loading,
  items,
  name,
  label,
  className,
  disabled,
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
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            items={items}
            {...field}
            {...props}
            disabled={loading || disabled}
            onBlur={onBlur}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
