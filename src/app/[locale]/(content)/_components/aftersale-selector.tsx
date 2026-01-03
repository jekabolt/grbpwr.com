import { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export interface AftersaleSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  list: string[];
  className?: string;
  renderLabel?: (value: string) => string;
}

export default function AftersaleSelector<T extends FieldValues>({
  control,
  name,
  list,
  className,
  renderLabel,
}: AftersaleSelectorProps<T>) {
  const t = useTranslations("accessibility");
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">{t("reason label")}:</FormLabel>
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
                  {renderLabel ? renderLabel(l) : l}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
