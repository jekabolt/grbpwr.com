import { useTranslations } from "next-intl";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
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
  formMessageGate?: boolean;
}

export default function AftersaleSelector<T extends FieldValues>({
  control,
  name,
  list,
  className,
  renderLabel,
  disabled = false,
  fiveOptionMobileGrid = false,
  formMessageGate,
}: AftersaleSelectorProps<T>) {
  const t = useTranslations("accessibility");
  const te = useTranslations("errors");
  const useOrderReviewGrid =
    fiveOptionMobileGrid && (list.length === 4 || list.length === 5);
  const useFiveDesktopLayout = useOrderReviewGrid && list.length === 5;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div
              role="group"
              aria-label={t("reason label")}
              className={cn(
                useOrderReviewGrid
                  ? useFiveDesktopLayout
                    ? "grid w-full grid-cols-2 gap-3 lg:grid-cols-6"
                    : "grid w-full grid-cols-2 gap-3 lg:grid-cols-4"
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
                  aria-pressed={l === field.value}
                  onClick={() => field.onChange(l)}
                  className={cn(
                    "flex min-h-[44px] items-center justify-center border border-textColor uppercase",
                    l === field.value && "bg-textColor text-bgColor",
                    useOrderReviewGrid && "w-full min-w-0",
                    useFiveDesktopLayout && i < 3 && "lg:col-span-2",
                    useFiveDesktopLayout && i >= 3 && "lg:col-span-3",
                  )}
                >
                  {renderLabel ? renderLabel(l) : l}
                </Button>
              ))}
            </div>
          </FormControl>
          <FormMessage
            translateError={te}
            fieldName={String(name)}
            gate={formMessageGate}
          />
        </FormItem>
      )}
    />
  );
}
