import { type Control } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";
import Checkbox from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  description?: string;
  loading?: boolean;
  control: Control<any>;
};

export const CheckboxField = ({ label, control, name, description }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-x-2">
            <FormControl>
              <Checkbox {...field} />
            </FormControl>
            <div
              className={cn({
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
};
