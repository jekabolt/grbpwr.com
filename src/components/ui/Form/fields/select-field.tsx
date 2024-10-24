import { type Control } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "..";
import Select from "@/components/ui/select";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  loading?: boolean;
  control: Control<any>;
  items: {
    label: string;
    value: string;
  }[];
};

export default function SelectField({
  loading,
  control,
  items,
  name,
  label,
  ...props
}: Props) {
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
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
