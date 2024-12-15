import { useFormContext } from "react-hook-form";

import Input, { InputProps } from "@/components/ui/input";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = InputProps & {
  description?: string;
  loading?: boolean;
};

export default function InputField({
  loading,
  name,
  label,
  description,
  type = "text",
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
          <FormControl>
            <Input
              type={type}
              disabled={loading}
              {...field}
              {...props}
              onBlur={onBlur}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
