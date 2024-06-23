import { type Control } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "..";
import Select from "@/components/ui/Select";

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

export const SelectField = ({
  loading,
  control,
  items,
  name,
  label,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            name={name}
            items={items}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
