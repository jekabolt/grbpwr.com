import { Control } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { AftersaleSchema } from "./schema";

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
                  variant={l === field.value ? "main" : "secondary"}
                  size="lg"
                  onClick={() => field.onChange(l)}
                  className="uppercase"
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
