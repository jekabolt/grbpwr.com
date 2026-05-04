import { useTranslations } from "next-intl";
import { Path, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { OrderReviewFormInput } from "../utils/order-review-schema";

export function RecommendCheckboxes({
  name,
  disabled,
  className,
  shouldBlink,
}: {
  name: Path<OrderReviewFormInput>;
  disabled?: boolean;
  className?: string;
  shouldBlink?: boolean;
}) {
  const t = useTranslations("order-review");
  const { control, trigger } = useFormContext<OrderReviewFormInput>();
  const nameStr = String(name);
  const yesId = `${nameStr}__yes`;
  const noId = `${nameStr}__no`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const syncAndValidate = () => {
          field.onBlur();
          void trigger(name);
        };

        return (
          <FormItem className={cn("relative flex flex-col gap-1", className)}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-2">
              {shouldBlink && <Overlay color="highlight" cover="container" />}
              <Text className="lg:text-right" variant="uppercase">
                {t("recommend")}
              </Text>
              <div className="flex w-full gap-2 lg:hidden">
                <Button
                  type="button"
                  variant={field.value === true ? "main" : "secondary"}
                  disabled={disabled}
                  className="flex-1 uppercase"
                  size="lg"
                  aria-pressed={field.value === true}
                  onClick={() => {
                    field.onChange(field.value === true ? undefined : true);
                    syncAndValidate();
                  }}
                >
                  {t("yes")}
                </Button>
                <Button
                  type="button"
                  variant={field.value === false ? "main" : "secondary"}
                  disabled={disabled}
                  className="flex-1 uppercase"
                  size="lg"
                  aria-pressed={field.value === false}
                  onClick={() => {
                    field.onChange(field.value === false ? undefined : false);
                    syncAndValidate();
                  }}
                >
                  {t("no")}
                </Button>
              </div>
              <div className="hidden items-center gap-x-2 lg:flex">
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Checkbox
                      name={yesId}
                      checked={field.value === true}
                      onCheckedChange={(c: boolean | "indeterminate") => {
                        if (c === true) field.onChange(true);
                        else field.onChange(undefined);
                      }}
                      disabled={disabled}
                      onBlur={() => void trigger(name)}
                    />
                  </FormControl>
                  <Text
                    component="label"
                    variant="uppercase"
                    htmlFor={yesId}
                    className={cn("cursor-pointer leading-none", {
                      "text-textInactiveColor": disabled,
                    })}
                  >
                    {t("yes")}
                  </Text>
                </div>
                <div className="flex items-center gap-1">
                  <FormControl>
                    <Checkbox
                      name={noId}
                      checked={field.value === false}
                      onCheckedChange={(c: boolean | "indeterminate") => {
                        if (c === true) field.onChange(false);
                        else field.onChange(undefined);
                      }}
                      disabled={disabled}
                      onBlur={() => void trigger(name)}
                    />
                  </FormControl>
                  <Text
                    component="label"
                    variant="uppercase"
                    htmlFor={noId}
                    className={cn("cursor-pointer leading-none", {
                      "text-textInactiveColor": disabled,
                    })}
                  >
                    {t("no")}
                  </Text>
                </div>
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
