import { z } from "zod";

import type {
  common_OrderItemReview,
  common_OrderReviewFull,
} from "@/api/proto-http/frontend";
import {
  DELIVERY_SPEED_VALUES,
  FIT_SCALE_VALUES,
  PACKAGING_VALUES,
  PRODUCT_RATING_VALUES,
} from "@/constants";

export function inConst<T extends readonly string[]>(values: T, v: string): v is T[number] {
  return (values as readonly string[]).includes(v);
}

export function isItemReviewRowEmpty(r: {
  rating: string;
  fitRating: string;
  recommend?: boolean;
}): boolean {
  return r.rating === "" && r.fitRating === "" && r.recommend === undefined;
}

export function buildOrderReviewFormSchema(required: string, itemCount: number) {
  return z.object({
    orderReview: z.object({
      deliveryRating: z.string().pipe(z.enum(DELIVERY_SPEED_VALUES, { message: required })),
      packagingRating: z.string().pipe(z.enum(PACKAGING_VALUES, { message: required })),
      sophisticationRating: z.string().pipe(z.enum(PRODUCT_RATING_VALUES, { message: required })),
      reviewText: z.string().max(1500).optional(),
    }),
    itemReviews: z
      .array(
        z
          .object({
            orderItemId: z.number().int().positive(),
            rating: z.string(),
            fitRating: z.string(),
            recommend: z.boolean().optional(),
          })
          .superRefine((data, ctx) => {
            if (isItemReviewRowEmpty(data)) return;
            if (!inConst(PRODUCT_RATING_VALUES, data.rating)) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ["rating"] });
              return;
            }
            if (!inConst(FIT_SCALE_VALUES, data.fitRating)) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ["fitRating"] });
            }
            if (data.recommend === undefined) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: required, path: ["recommend"] });
            }
          }),
      )
      .length(itemCount),
  });
}

export function buildOrderReviewDefaultValues(
  items: readonly { id: number }[],
  reviewFull?: common_OrderReviewFull,
): OrderReviewFormInput {
  const o = reviewFull?.orderReview;

  const byId = new Map<number, common_OrderItemReview>(
    (reviewFull?.itemReviews ?? [])
      .filter((r): r is common_OrderItemReview & { orderItemId: number } => r.orderItemId != null)
      .map((r) => [r.orderItemId, r]),
  );

  const pick = <T extends readonly string[]>(values: T, v: string | undefined) =>
    v && inConst(values, v) ? v : "";

  return {
    orderReview: {
      deliveryRating: pick(DELIVERY_SPEED_VALUES, o?.deliveryRating),
      packagingRating: pick(PACKAGING_VALUES, o?.packagingRating),
      sophisticationRating: pick(PRODUCT_RATING_VALUES, o?.sophisticationRating),
      reviewText: o?.reviewText ?? "",
    },
    itemReviews: items.map((item) => {
      const row = byId.get(item.id);
      return {
        orderItemId: item.id,
        rating: pick(PRODUCT_RATING_VALUES, row?.rating),
        fitRating: pick(FIT_SCALE_VALUES, row?.fitRating),
        recommend: row?.recommend,
      };
    }),
  };
}

export type OrderReviewFormInput = z.input<ReturnType<typeof buildOrderReviewFormSchema>>;
export type OrderReviewFormValues = z.infer<ReturnType<typeof buildOrderReviewFormSchema>>;

