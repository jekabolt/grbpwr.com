"use client";

import { use, useMemo, useState } from "react";
import type { common_OrderFull } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { Path } from "react-hook-form";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextareaField from "@/components/ui/form/fields/textarea-field";
import { SubmissionToaster } from "@/components/ui/toaster";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import AftersaleSelector from "@/app/[locale]/(content)/_components/aftersale-selector";

import { MobileOrderReviewSummary } from "./mobile-order-review-summary";
import { OrderReviewProductRow } from "./order-review-product-row";
import {
  buildOrderReviewFormSchema,
  DELIVERY_SPEED_VALUES,
  ORDER_REVIEW_DEFAULT_FIT_RATING,
  PACKAGING_VALUES,
  PRODUCT_RATING_VALUES,
  REVIEW_ENUM_PREFIX,
  type OrderReviewFormInput,
  type OrderReviewFormValues,
} from "./order-review-schema";

type ReviewFormStep = {
  step: string;
  title: string;
  name: Path<OrderReviewFormInput>;
  list: string[];
  renderLabel: (value: string) => string;
};

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
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const formSchema = useMemo(
    () => buildOrderReviewFormSchema(t("field required"), validItems.length),
    [t, validItems.length],
  );

  const defaultValues = useMemo((): OrderReviewFormInput => {
    return {
      orderReview: {
        deliveryRating: "",
        packagingRating: "",
        sophisticationRating: "",
        reviewText: "",
      },
      itemReviews: validItems.map((it) => ({
        orderItemId: it.id as number,
        rating: "",
        fitRating: ORDER_REVIEW_DEFAULT_FIT_RATING,
        recommend: undefined,
      })),
    };
  }, [validItems]);

  const form = useForm<OrderReviewFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const formSteps = useMemo((): ReviewFormStep[] => {
    const total = validItems.length > 0 ? 4 : 3;
    let n = 0;
    const step = () => `${++n}/${total}`;

    const labelDelivery = (value: string) =>
      t(`dSpeed.${value.replace(REVIEW_ENUM_PREFIX.delivery, "")}`);
    const labelPackaging = (value: string) =>
      t(`pPackaging.${value.replace(REVIEW_ENUM_PREFIX.packaging, "")}`);
    const labelSophistication = (value: string) =>
      t(
        `pSophistication.${value.replace(REVIEW_ENUM_PREFIX.productRating, "")}`,
      );

    return [
      {
        step: step(),
        title: t("delivery speed"),
        name: "orderReview.deliveryRating",
        list: [...DELIVERY_SPEED_VALUES],
        renderLabel: labelDelivery,
      },
      {
        step: step(),
        title: t("packaging"),
        name: "orderReview.packagingRating",
        list: [...PACKAGING_VALUES],
        renderLabel: labelPackaging,
      },
      {
        step: step(),
        title: t("sophistication"),
        name: "orderReview.sophisticationRating",
        list: [...PRODUCT_RATING_VALUES],
        renderLabel: labelSophistication,
      },
    ];
  }, [t, validItems.length]);

  const reviewSubmitB64Email = useMemo(() => {
    const email = orderData?.buyer?.buyerInsert?.email?.trim();
    if (email && typeof window !== "undefined") {
      return window.btoa(email);
    }
    return b64Email;
  }, [orderData?.buyer?.buyerInsert?.email, b64Email]);

  if (!orderData) {
    return null;
  }

  async function onSubmit(data: OrderReviewFormInput) {
    const validated = data as unknown as OrderReviewFormValues;
    setSubmitting(true);
    try {
      await serviceClient.SubmitOrderReview({
        orderUuid,
        b64Email: reviewSubmitB64Email,
        orderReview: {
          deliveryRating: validated.orderReview.deliveryRating,
          packagingRating: validated.orderReview.packagingRating,
          sophisticationRating: validated.orderReview.sophisticationRating,
          reviewText: validated.orderReview.reviewText?.trim() || undefined,
        },
        itemReviews: validated.itemReviews.map((r) => ({
          orderItemId: r.orderItemId,
          rating: r.rating,
          fitRating: r.fitRating,
          recommend: r.recommend ?? false,
        })),
      });
      setToastMessage(t("success"));
      setToastOpen(true);
    } catch (e) {
      console.error(e);
      setToastMessage(t("error"));
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full min-h-0 w-full flex-1 flex-col"
        >
          <div className="relative flex min-h-0 flex-1 flex-col gap-y-10 lg:flex-row lg:gap-52">
            <div className="w-full space-y-10 lg:min-h-0 lg:flex-1">
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
            <div className="flex w-full flex-col space-y-10 lg:min-h-0 lg:flex-1">
              {validItems.length > 0 && (
                <FieldsGroupContainer
                  stage="4/4"
                  title={t("item heading")}
                  collapsible={false}
                  childrenOffset="stage"
                  className="flex min-h-0 flex-col lg:flex-1"
                  childrenSpacingClass="flex min-h-0 flex-1 flex-col space-y-8"
                >
                  <div className="block shrink-0 lg:hidden">
                    <MobileOrderReviewSummary
                      orderData={orderData}
                      orderItemReviewRows={orderItemReviewRows}
                      itemsTitle={t("item heading")}
                      disabled={submitting}
                    />
                  </div>
                  <div className="hidden w-full space-y-3 overflow-y-auto lg:block lg:min-h-0 lg:flex-1">
                    {orderItemReviewRows.map((row) => (
                      <OrderReviewProductRow
                        key={row.key}
                        product={row.product}
                        itemIndex={row.lineItemIndex}
                        disabled={submitting}
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
                    disabled={submitting || !form.formState.isValid}
                    className="w-full uppercase"
                  >
                    {submitting ? t("submitting") : t("submit")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-2.5 z-50 mt-10 block shrink-0 lg:hidden">
            <Button
              type="submit"
              variant="main"
              size="lg"
              loading={submitting}
              disabled={submitting || !form.formState.isValid}
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
