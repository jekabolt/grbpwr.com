import { Control } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { AftersaleSchema } from "../aftersale-services/_components/schema";

export default function AftersaleSelector({
  control,
  name,
  list,
  className,
}: {
  control: Control<AftersaleSchema>;
  name: keyof AftersaleSchema;
  list: string[];
  className?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">reason:</FormLabel>
          <FormControl>
            <div className={cn("flex flex-wrap gap-3", className)}>
              {list.map((l, i) => (
                <Button
                  key={i}
                  type="button"
                  size="lg"
                  onClick={() => field.onChange(l)}
                  className={cn(
                    "border border-textColor uppercase",
                    l === field.value && "bg-textColor text-bgColor",
                  )}
                >
                  {l}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
