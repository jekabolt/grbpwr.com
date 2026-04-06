import type {
  common_FitScaleEnum,
  common_OrderFull,
  common_ProductRatingEnum,
} from "@/api/proto-http/frontend";
import { serviceClient } from "@/lib/api";
import { useCallback, useMemo, useState } from "react";

import {
  isItemReviewRowEmpty,
  type OrderReviewFormValues,
} from "./order-review-schema";

type Translations = (key: string) => string;

export function useOrderReviewSubmit({
  orderUuid,
  b64Email,
  orderData,
  t,
}: {
  orderUuid: string;
  b64Email: string;
  orderData: common_OrderFull | undefined;
  t: Translations;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const reviewSubmitB64Email = useMemo(() => {
    const email = orderData?.buyer?.buyerInsert?.email?.trim();
    if (email && typeof window !== "undefined") {
      return window.btoa(email);
    }
    return b64Email;
  }, [orderData?.buyer?.buyerInsert?.email, b64Email]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  const submitReview = useCallback(
    async (data: OrderReviewFormValues) => {
      setSubmitting(true);
      try {
        const reviewedItems = data.itemReviews.filter(
          (r) => !isItemReviewRowEmpty(r),
        );
        await serviceClient.SubmitOrderReview({
          orderUuid,
          b64Email: reviewSubmitB64Email,
          orderReview: {
            deliveryRating: data.orderReview.deliveryRating,
            packagingRating: data.orderReview.packagingRating,
            sophisticationRating: data.orderReview.sophisticationRating,
            reviewText: data.orderReview.reviewText?.trim() || undefined,
          },
          itemReviews:
            reviewedItems.length > 0
              ? reviewedItems.map((r) => ({
                orderItemId: r.orderItemId,
                rating: r.rating as common_ProductRatingEnum,
                fitRating: r.fitRating as common_FitScaleEnum,
                recommend: r.recommend ?? undefined,
              }))
              : undefined,
        });
        showToast(t("success"));
      } catch (e) {
        console.error(e);
        showToast(t("error"));
      } finally {
        setSubmitting(false);
      }
    },
    [orderUuid, reviewSubmitB64Email, showToast, t],
  );

  return {
    submitting,
    toastOpen,
    toastMessage,
    setToastOpen,
    submitReview,
    showToast,
  };
}
