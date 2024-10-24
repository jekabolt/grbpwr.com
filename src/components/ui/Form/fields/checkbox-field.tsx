import { type Control } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";
import Checkbox from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  description?: string;
  loading?: boolean;
  control: Control<any>;
};

export default function CheckboxField({
  label,
  control,
  name,
  description,
}: Props) {
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
