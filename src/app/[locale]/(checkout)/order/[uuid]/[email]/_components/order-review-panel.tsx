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

import { OrderReviewProductRow } from "./order-review-product-row";
import {
  buildOrderReviewFormSchema,
  DELIVERY_SPEED_VALUES,
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
        fitRating: "",
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
    const labelProductRating = (value: string) =>
      t(`pRating.${value.replace(REVIEW_ENUM_PREFIX.productRating, "")}`);

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
        renderLabel: labelProductRating,
      },
    ];
  }, [t, validItems.length]);

  if (!orderData) {
    return null;
  }

  async function onSubmit(data: OrderReviewFormInput) {
    const validated = data as unknown as OrderReviewFormValues;
    setSubmitting(true);
    try {
      await serviceClient.SubmitOrderReview({
        orderUuid,
        b64Email,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex justify-between lg:gap-52">
            <div className="w-full space-y-10">
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
            </div>

            <div className="w-full">
              {validItems.length > 0 && (
                <FieldsGroupContainer
                  stage="4/4"
                  title={t("item heading")}
                  collapsible={false}
                  childrenOffset="stage"
                >
                  <div className="w-full space-y-3">
                    {validItems.map((item, index) => (
                      <OrderReviewProductRow
                        key={item.id ?? index}
                        product={item}
                        itemIndex={index}
                        disabled={submitting}
                      />
                    ))}
                  </div>
                </FieldsGroupContainer>
              )}
              <TextareaField
                name="orderReview.reviewText"
                loading={submitting}
                rows={1}
                maxLength={1500}
                showCharCount
              />
              <Button
                type="submit"
                variant="main"
                size="lg"
                loading={submitting}
                disabled={submitting || !form.formState.isValid}
                className="uppercase md:ml-14"
              >
                {submitting ? t("submitting") : t("submit")}
              </Button>
            </div>
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
