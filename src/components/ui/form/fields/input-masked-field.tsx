import { useFormContext } from "react-hook-form";

import { InputMask, InputMaskProps } from "@/components/ui/input-masked";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = InputMaskProps & {
  description?: string;
  loading?: boolean;
};

export default function InputMaskedField({
  loading,
  name,
  label,
  description,
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
            <InputMask
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
