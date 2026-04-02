import { useTranslations } from "next-intl";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface AftersaleSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  list: string[];
  className?: string;
  renderLabel?: (value: string) => string;
  disabled?: boolean;
  fiveOptionMobileGrid?: boolean;
}

export default function AftersaleSelector<T extends FieldValues>({
  control,
  name,
  list,
  className,
  renderLabel,
  disabled = false,
  fiveOptionMobileGrid = false,
}: AftersaleSelectorProps<T>) {
  const t = useTranslations("accessibility");
  const te = useTranslations("errors");
  const useFiveGrid = fiveOptionMobileGrid && list.length === 5;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">{t("reason label")}:</FormLabel>
          <FormControl>
            <div
              className={cn(
                useFiveGrid
                  ? "grid w-full grid-cols-6 gap-3"
                  : "flex flex-wrap gap-3",
                className,
              )}
            >
              {list.map((l, i) => (
                <Button
                  key={i}
                  type="button"
                  size="lg"
                  disabled={disabled}
                  onClick={() => field.onChange(l)}
                  className={cn(
                    "border border-textColor uppercase",
                    l === field.value && "bg-textColor text-bgColor",
                    useFiveGrid &&
                      i < 3 &&
                      "col-span-2 w-full min-w-0 lg:w-auto",
                    useFiveGrid &&
                      i >= 3 &&
                      "col-span-3 w-full min-w-0 lg:w-auto",
                  )}
                >
                  {renderLabel ? renderLabel(l) : l}
                </Button>
              ))}
            </div>
          </FormControl>
          <FormMessage translateError={te} fieldName={String(name)} />
        </FormItem>
      )}
    />
  );
}
