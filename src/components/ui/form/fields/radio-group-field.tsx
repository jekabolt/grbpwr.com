import { useFormContext } from "react-hook-form";

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
};

export default function RadioGroupField({
  loading,
  name,
  description,
  view,
  onChange,
  ...props
}: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              view={view}
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
