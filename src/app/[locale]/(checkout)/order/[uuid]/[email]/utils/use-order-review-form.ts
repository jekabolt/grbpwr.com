import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import type { Path } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import type { common_OrderReviewFull } from "@/api/proto-http/frontend";
import {
  DELIVERY_SPEED_VALUES,
  PACKAGING_VALUES,
  PRODUCT_RATING_VALUES,
  REVIEW_ENUM_PREFIX,
} from "@/constants";

import {
  buildOrderReviewDefaultValues,
  buildOrderReviewFormSchema,
  inConst,
  type OrderReviewFormInput,
  type OrderReviewFormValues,
} from "./order-review-schema";

export type OrderReviewFormStep = {
  step: string;
  title: string;
  name: Path<OrderReviewFormInput>;
  list: string[];
  renderLabel: (value: string) => string;
};

type ValidOrderItem = { id: number | null | undefined };

type Translations = (key: string) => string;

export function useOrderReviewForm({
  validItems,
  orderReviewFull,
  t,
}: {
  validItems: readonly ValidOrderItem[];
  orderReviewFull?: common_OrderReviewFull | undefined;
  t: Translations;
}) {
  const itemIdsKey = useMemo(
    () => validItems.map((it) => String(it.id ?? "")).join(","),
    [validItems],
  );

  const reviewHydrationKey = useMemo(() => {
    if (!orderReviewFull) return "";
    const o = orderReviewFull.orderReview;
    const lines = (orderReviewFull.itemReviews ?? []).map(
      (r) =>
        `${r.orderItemId ?? ""}:${r.rating ?? ""}:${r.fitRating ?? ""}:${r.recommend === true ? "1" : r.recommend === false ? "0" : ""
        }`,
    );
    return [
      o?.id ?? "",
      o?.deliveryRating ?? "",
      o?.packagingRating ?? "",
      o?.sophisticationRating ?? "",
      o?.reviewText ?? "",
      ...lines,
    ].join("|");
  }, [orderReviewFull]);

  const formSchema = useMemo(
    () => buildOrderReviewFormSchema(t("field required"), validItems.length),
    [t, validItems.length],
  );

  const defaultValues = useMemo(
    (): OrderReviewFormInput =>
      buildOrderReviewDefaultValues(
        validItems.map((it) => ({ id: it.id as number })),
        orderReviewFull,
      ),
    [validItems, orderReviewFull],
  );

  const form = useForm<OrderReviewFormInput, unknown, OrderReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset when line items or saved review data change (`reviewHydrationKey` fingerprints review payload).
  useEffect(() => {
    form.reset(
      buildOrderReviewDefaultValues(
        validItems.map((it) => ({ id: it.id as number })),
        orderReviewFull,
      ),
    );
  }, [form, itemIdsKey, reviewHydrationKey, orderReviewFull, validItems]);

  const [deliveryRating, packagingRating, sophisticationRating] = useWatch({
    control: form.control,
    name: [
      "orderReview.deliveryRating",
      "orderReview.packagingRating",
      "orderReview.sophisticationRating",
    ],
  });

  const orderSectionsComplete = useMemo(() => {
    return (
      !!deliveryRating &&
      inConst(DELIVERY_SPEED_VALUES, deliveryRating) &&
      !!packagingRating &&
      inConst(PACKAGING_VALUES, packagingRating) &&
      !!sophisticationRating &&
      inConst(PRODUCT_RATING_VALUES, sophisticationRating)
    );
  }, [deliveryRating, packagingRating, sophisticationRating]);

  const { formSteps, itemStageLabel } = useMemo(() => {
    const totalSteps = validItems.length > 0 ? 4 : 3;
    let n = 0;
    const step = () => `${++n}/${totalSteps}`;

    const labelDelivery = (value: string) =>
      t(`dSpeed.${value.replace(REVIEW_ENUM_PREFIX.delivery, "")}`);
    const labelPackaging = (value: string) =>
      t(`pPackaging.${value.replace(REVIEW_ENUM_PREFIX.packaging, "")}`);
    const labelSophistication = (value: string) =>
      t(
        `pSophistication.${value.replace(REVIEW_ENUM_PREFIX.productRating, "")}`,
      );

    const steps: OrderReviewFormStep[] = [
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

    return {
      formSteps: steps,
      itemStageLabel:
        validItems.length > 0 ? `${totalSteps}/${totalSteps}` : null,
    };
  }, [t, validItems.length]);

  return {
    form,
    formSteps,
    itemStageLabel,
    orderSectionsComplete,
  };
}
