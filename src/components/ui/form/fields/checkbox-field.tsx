import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";

type Props = {
  name: string;
  label: string;
  description?: string;
  loading?: boolean;
  disabled?: boolean;
  [k: string]: any;
};

export default function CheckboxField({
  label,
  name,
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
          <div className="flex items-center gap-x-2">
            <FormControl>
              <Checkbox
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={onBlur}
                {...props}
              />
            </FormControl>
            <div
              className={cn("leading-none", {
                "space-y-1": description,
              })}
            >
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
