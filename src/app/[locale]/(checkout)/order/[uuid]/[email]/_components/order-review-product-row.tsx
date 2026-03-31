"use client";

import { useMemo } from "react";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useTranslations } from "next-intl";
import type { Path } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import SelectField from "@/components/ui/form/fields/select-field";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import CartItemSize from "@/app/[locale]/(checkout)/cart/_components/CartItemSize";
import AftersaleSelector from "@/app/[locale]/(content)/_components/aftersale-selector";

import {
  FIT_SCALE_VALUES,
  PRODUCT_RATING_VALUES,
  REVIEW_ENUM_PREFIX,
  type OrderReviewFormInput,
} from "./order-review-schema";

function RecommendCheckboxes({
  name,
  disabled,
  className,
}: {
  name: Path<OrderReviewFormInput>;
  disabled?: boolean;
  className?: string;
}) {
  const t = useTranslations("order-review");
  const te = useTranslations("errors");
  const { control, trigger } = useFormContext<OrderReviewFormInput>();
  const nameStr = String(name);
  const yesId = `${nameStr}__yes`;
  const noId = `${nameStr}__no`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-1", className)}>
          <div className="flex flex-col gap-2">
            <Text className="text-right" variant="uppercase">
              {t("recommend")}
            </Text>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-4">
                <FormControl>
                  <Checkbox
                    name={yesId}
                    checked={field.value === true}
                    onCheckedChange={(c: CheckedState) => {
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
              <div className="flex items-center gap-x-4">
                <FormControl>
                  <Checkbox
                    name={noId}
                    checked={field.value === false}
                    onCheckedChange={(c: CheckedState) => {
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
          <FormMessage translateError={te} fieldName={nameStr} />
        </FormItem>
      )}
    />
  );
}

export function OrderReviewProductRow({
  product,
  itemIndex,
  disabled,
}: {
  product: common_OrderItem;
  itemIndex: number;
  disabled?: boolean;
}) {
  const { control } = useFormContext<OrderReviewFormInput>();
  const { languageId } = useTranslationsStore((s) => s);
  const t = useTranslations("order-review");

  const productName =
    product.translations?.find((tr) => tr.languageId === languageId)?.name ||
    product.sku ||
    "";

  const fitItems = useMemo(
    () =>
      FIT_SCALE_VALUES.map((value) => ({
        value,
        label: t(`fFit.${value.replace(REVIEW_ENUM_PREFIX.fit, "")}`),
      })),
    [t],
  );

  const labelProductRating = (value: string) =>
    t(`pRating.${value.replace(REVIEW_ENUM_PREFIX.productRating, "")}`);

  return (
    <div className="space-y-6 border-b border-textColor py-6 last:border-b-0">
      <div className="flex items-stretch gap-x-3">
        <div className="relative h-full min-w-[90px] shrink-0 self-start">
          <Image
            src={product.thumbnail || ""}
            alt=""
            fit="contain"
            aspectRatio="4/5"
          />
        </div>
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
          <Text
            className="line-clamp-2 overflow-hidden text-ellipsis"
            variant="uppercase"
          >
            {productName}
          </Text>
          <div className="mt-auto flex w-full min-w-0 flex-row flex-nowrap items-end gap-x-4 overflow-x-auto pb-1 pt-8 md:gap-x-6">
            <div className="shrink-0">
              <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
            </div>
            <div className="min-w-0 flex-1 basis-[12rem]">
              <SelectField
                name={`itemReviews.${itemIndex}.fitRating`}
                label={""}
                items={fitItems}
                placeholder={t("placeholder select")}
                loading={disabled}
              />
            </div>
            <RecommendCheckboxes
              className="shrink-0"
              name={`itemReviews.${itemIndex}.recommend`}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      <AftersaleSelector
        control={control}
        name={`itemReviews.${itemIndex}.rating`}
        list={[...PRODUCT_RATING_VALUES]}
        className="w-full gap-4 overflow-x-auto pb-1 md:flex-wrap"
        renderLabel={labelProductRating}
        disabled={disabled}
      />
    </div>
  );
}
