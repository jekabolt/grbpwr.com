import { type Control } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../..";
import RadioGroup, { RadioGroupsProps } from "@/components/ui/RadioGroup";

type Props = RadioGroupsProps & {
  description?: string;
  loading?: boolean;
  control: Control<any>;
  label: string;
};

export default function RadioGroupField({
  loading,
  control,
  name,
  label,
  description,
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
              onValueChange={field.onChange}
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
