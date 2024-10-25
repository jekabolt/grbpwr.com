import { type Control } from "react-hook-form";

import RadioGroup, { RadioGroupsProps } from "@/components/ui/radio-group";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "..";

type Props = RadioGroupsProps & {
  description?: string;
  loading?: boolean;
  control: Control<any>;
};

export default function RadioGroupField({
  loading,
  control,
  name,
  description,
  onChange,
  ...props
}: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              disabled={loading}
              {...field}
              onValueChange={(v: string) => {
                if (onChange) {
                  onChange(v);
                }

                field.onChange(v);
              }}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
