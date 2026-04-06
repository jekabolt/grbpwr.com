"use client";

import { useMemo, type RefCallback } from "react";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import {
  FIT_SCALE_VALUES,
  PRODUCT_RATING_VALUES,
  REVIEW_ENUM_PREFIX,
} from "@/constants";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useTranslations } from "next-intl";
import type { Path } from "react-hook-form";
import { useFormContext, useFormState } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import SelectField from "@/components/ui/form/fields/select-field";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import CartItemSize from "@/app/[locale]/(checkout)/cart/_components/CartItemSize";
import AftersaleSelector from "@/app/[locale]/(content)/_components/aftersale-selector";

import { type OrderReviewFormInput } from "../utils/order-review-schema";

function RecommendCheckboxes({
  name,
  disabled,
  className,
  shouldBlink,
}: {
  name: Path<OrderReviewFormInput>;
  disabled?: boolean;
  className?: string;
  formMessageGate?: boolean;
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
      render={({ field }) => (
        <FormItem className={cn("relative flex flex-col gap-1", className)}>
          <div className="flex flex-row justify-between gap-2">
            {shouldBlink && <Overlay color="highlight" cover="container" />}
            <Text className="text-right" variant="uppercase">
              {t("recommend")}
            </Text>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-1">
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
              <div className="flex items-center gap-1">
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
        </FormItem>
      )}
    />
  );
}

export function OrderReviewProductRow({
  product,
  itemIndex,
  disabled,
  shouldBlinkFit,
  shouldBlinkRecommend,
  mobileSummaryFitSelect = false,
  length,
  rowRef,
}: {
  product: common_OrderItem;
  itemIndex: number;
  disabled?: boolean;
  shouldBlinkFit?: boolean;
  shouldBlinkRecommend?: boolean;
  mobileSummaryFitSelect?: boolean;
  length?: number;
  rowRef?: RefCallback<HTMLDivElement>;
}) {
  const { control } = useFormContext<OrderReviewFormInput>();
  const { dirtyFields } = useFormState({ control });
  const itemRowDirty = Boolean(
    dirtyFields.itemReviews?.[itemIndex]?.rating ||
      dirtyFields.itemReviews?.[itemIndex]?.fitRating ||
      dirtyFields.itemReviews?.[itemIndex]?.recommend,
  );
  const { languageId } = useTranslationsStore((s) => s);
  const t = useTranslations("order-review");

  const productName =
    product.translations?.find((tr) => tr.languageId === languageId)?.name ||
    product.sku ||
    "";

  const lineQty = product.orderItem?.quantity ?? 1;

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
    <div
      ref={rowRef}
      className={cn(
        "group flex min-h-0 flex-1 flex-col gap-6 border-b border-textInactiveColor py-6 first:pt-0 last:border-b-0",
        "lg:flex-none [&:last-child:not(:only-child)]:lg:min-h-0 [&:last-child:not(:only-child)]:lg:flex-1",
        {
          "lg:pb-0": length === 1,
        },
      )}
    >
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
          <div className="mt-auto flex w-full min-w-0 items-end justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-end justify-between gap-3">
              <div className="flex shrink-0 items-start gap-2">
                <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
                {lineQty > 1 && (
                  <Text variant="uppercase" className="text-textInactiveColor">
                    ×{lineQty}
                  </Text>
                )}
              </div>
              <div
                className={cn(
                  "relative flex items-start gap-3 bg-bgColor",
                  mobileSummaryFitSelect &&
                    "min-w-0 flex-1 flex-nowrap items-start",
                )}
              >
                {shouldBlinkFit && itemRowDirty && (
                  <Overlay color="highlight" cover="container" />
                )}
                <Text
                  variant="uppercase"
                  className={cn(mobileSummaryFitSelect && "shrink-0")}
                >
                  {t("fit")}:
                </Text>
                <div
                  className={cn(
                    mobileSummaryFitSelect ? "min-w-0 flex-1" : "min-w-32",
                  )}
                >
                  <SelectField
                    name={`itemReviews.${itemIndex}.fitRating`}
                    items={fitItems}
                    placeholder={t("placeholder select")}
                    className="[&[data-placeholder]]:uppercase"
                    hideFormMessage
                    loading={disabled}
                    fullWidth
                    singleLineSelectedValue={mobileSummaryFitSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AftersaleSelector
        control={control}
        name={`itemReviews.${itemIndex}.rating`}
        list={[...PRODUCT_RATING_VALUES]}
        className="w-full lg:justify-between"
        renderLabel={labelProductRating}
        disabled={disabled}
        fiveOptionMobileGrid
        formMessageGate={itemRowDirty}
      />
      <div
        className="hidden min-h-0 flex-1 group-[&:last-child:not(:only-child)]:lg:block"
        aria-hidden
      />
      <RecommendCheckboxes
        className="shrink-0"
        name={`itemReviews.${itemIndex}.recommend`}
        disabled={disabled}
        // formMessageGate={itemRowDirty}
        shouldBlink={shouldBlinkRecommend}
      />
    </div>
  );
}
