"use client";

import { use, useCallback, useMemo, useState, type RefCallback } from "react";
import type { common_OrderFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import type { SubmitErrorHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextareaField from "@/components/ui/form/fields/textarea-field";
import { SubmissionToaster } from "@/components/ui/toaster";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import AftersaleSelector from "@/app/[locale]/(content)/_components/aftersale-selector";

import type { OrderReviewFormInput } from "../utils/order-review-schema";
import { useFitRatingBlink } from "../utils/use-fit-rating-blink";
import { useOrderReviewForm } from "../utils/use-order-review-form";
import { useOrderReviewItemRowScroll } from "../utils/use-order-review-item-row-scroll";
import { useOrderReviewRightColHeight } from "../utils/use-order-review-right-col-height";
import { useOrderReviewSubmit } from "../utils/use-order-review-submit";
import { MobileOrderReviewSummary } from "./mobile-order-review-summary";
import { OrderReviewProductRow } from "./order-review-product-row";

export function OrderReviewPanel({
  orderUuid,
  b64Email,
  orderPromise,
}: {
  orderUuid: string;
  b64Email: string;
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
}) {
  const { order: orderData } = use(orderPromise);
  const t = useTranslations("order-review");
  const validItems = useMemo(
    () => orderData?.orderItems?.filter((i) => i.id != null) ?? [],
    [orderData?.orderItems],
  );

  const orderItemReviewRows = useMemo(
    () =>
      validItems.map((item, lineItemIndex) => ({
        key: `${item.id ?? lineItemIndex}`,
        product: item,
        lineItemIndex,
      })),
    [validItems],
  );

  const { form, formSteps, itemStageLabel, orderSectionsComplete } =
    useOrderReviewForm({
      validItems,
      orderReviewFull: orderData?.orderReview,
      t,
    });

  const {
    submitting,
    toastOpen,
    toastMessage,
    setToastOpen,
    submitReview,
    showToast,
  } = useOrderReviewSubmit({
    orderUuid,
    b64Email,
    orderData,
    t,
  });

  const { fitBlinkingIndices, triggerFitBlink } = useFitRatingBlink();
  const [mobileItemsSectionOpen, setMobileItemsSectionOpen] = useState(true);

  const { mobileRowRefByIndex, desktopRowRefByIndex } =
    useOrderReviewItemRowScroll(orderItemReviewRows, fitBlinkingIndices);

  const [leftColEl, setLeftColEl] = useState<HTMLDivElement | null>(null);
  const setLeftColRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    setLeftColEl(node);
  }, []);
  const rightColHeightPx = useOrderReviewRightColHeight(leftColEl);

  const onSubmitInvalid: SubmitErrorHandler<OrderReviewFormInput> = useCallback(
    (errors) => {
      const indices: number[] = [];
      const rows = errors.itemReviews;
      if (Array.isArray(rows)) {
        rows.forEach((row, i) => {
          if (row?.fitRating) indices.push(i);
        });
      }
      if (indices.length > 0) {
        setMobileItemsSectionOpen(true);
        showToast(t("select fit before submit"));
        triggerFitBlink(indices);
      }
    },
    [showToast, t, triggerFitBlink],
  );

  if (!orderData) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitReview, onSubmitInvalid)}
          className="flex h-full min-h-0 w-full flex-1 flex-col"
        >
          <div className="relative flex h-full min-h-0 flex-1 flex-col gap-y-10 lg:flex-row lg:items-start lg:gap-52">
            <div
              ref={setLeftColRef}
              className="flex w-full flex-col space-y-10 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
              {formSteps.map((config, i) => (
                <FieldsGroupContainer
                  key={`${config.name}-${i}`}
                  stage={config.step}
                  title={config.title}
                  collapsible={false}
                  childrenOffset="stage"
                >
                  <AftersaleSelector
                    control={form.control}
                    name={config.name}
                    list={config.list}
                    className="w-full"
                    renderLabel={config.renderLabel}
                    disabled={submitting}
                  />
                </FieldsGroupContainer>
              ))}
              <div className="hidden lg:block">
                <TextareaField
                  name="orderReview.reviewText"
                  loading={submitting}
                  rows={16}
                  className="max-h-32 min-h-32 placeholder:uppercase"
                  placeholder={t("enter review")}
                  maxLength={1500}
                  showCharCount
                />
              </div>
            </div>
            <div
              className="flex min-h-0 w-full flex-1 flex-col space-y-10 lg:min-h-0 lg:flex-1 lg:space-y-4 lg:self-start lg:overflow-hidden"
              style={
                rightColHeightPx != null
                  ? { height: rightColHeightPx }
                  : undefined
              }
            >
              {validItems.length > 0 && itemStageLabel && (
                <FieldsGroupContainer
                  stage={itemStageLabel}
                  title={t("item heading")}
                  collapsible={false}
                  childrenOffset="stage"
                  className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0 lg:flex-1"
                  childrenSpacingClass="flex min-h-0 min-w-0 flex-1 flex-col space-y-8 overflow-hidden lg:min-h-0 lg:flex-1 lg:space-y-0"
                >
                  <div className="flex min-h-0 flex-1 flex-col lg:hidden">
                    <MobileOrderReviewSummary
                      orderItemReviewRows={orderItemReviewRows}
                      itemsTitle={t("item heading")}
                      disabled={submitting}
                      fitBlinkingIndices={fitBlinkingIndices}
                      itemsSectionOpen={mobileItemsSectionOpen}
                      onItemsSectionOpenChange={setMobileItemsSectionOpen}
                      rowRef={(idx) => mobileRowRefByIndex.get(idx)}
                    />
                  </div>
                  <div className="hidden min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto lg:flex lg:min-h-0 lg:overflow-y-auto">
                    {orderItemReviewRows.map((row) => (
                      <OrderReviewProductRow
                        key={row.key}
                        product={row.product}
                        itemIndex={row.lineItemIndex}
                        disabled={submitting}
                        fillScrollAreaOnDesktop={
                          row.lineItemIndex === orderItemReviewRows.length - 1
                        }
                        shouldBlinkFit={fitBlinkingIndices.includes(
                          row.lineItemIndex,
                        )}
                        rowRef={desktopRowRefByIndex.get(row.lineItemIndex)}
                      />
                    ))}
                  </div>
                </FieldsGroupContainer>
              )}
              <div className="shrink-0 space-y-6">
                <div className="block lg:hidden">
                  <TextareaField
                    name="orderReview.reviewText"
                    loading={submitting}
                    rows={16}
                    className="max-h-32 min-h-32 placeholder:uppercase"
                    placeholder={t("enter review")}
                    maxLength={1500}
                    showCharCount
                  />
                </div>
                <div className="hidden w-full lg:block">
                  <Button
                    type="submit"
                    variant="main"
                    size="lg"
                    loading={submitting}
                    disabled={submitting || !orderSectionsComplete}
                    className="w-full uppercase"
                  >
                    {submitting ? t("submitting") : t("submit")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-2.5 z-10 mt-10 block shrink-0 lg:hidden">
            <Button
              type="submit"
              variant="main"
              size="lg"
              loading={submitting}
              disabled={submitting || !orderSectionsComplete}
              className="w-full uppercase"
            >
              {submitting ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </>
  );
}
