import { type Control } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "..";
import Select from "@/components/ui/Select";

type Props = {
  name: string;
  label: string;
  loading?: boolean;
  placeholder?: string;
  control: Control<any>;
  items: {
    label: string;
    value: string;
  }[];
};

export const SelectField = ({ control, items, name, label }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select {...field} items={items} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
