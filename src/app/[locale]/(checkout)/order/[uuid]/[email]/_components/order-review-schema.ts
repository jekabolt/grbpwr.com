import { z } from "zod";

/** Strip these to match `order-review` message keys (e.g. dSpeed.MUCH_FASTER_THAN_EXPECTED). */
export const REVIEW_ENUM_PREFIX = {
  delivery: "DELIVERY_SPEED_ENUM_",
  packaging: "PACKAGING_CONDITION_ENUM_",
  productRating: "PRODUCT_RATING_ENUM_",
  fit: "FIT_SCALE_ENUM_",
} as const;

export const DELIVERY_SPEED_VALUES = [
  "DELIVERY_SPEED_ENUM_MUCH_FASTER_THAN_EXPECTED",
  "DELIVERY_SPEED_ENUM_FASTER_THAN_EXPECTED",
  "DELIVERY_SPEED_ENUM_AS_EXPECTED",
  "DELIVERY_SPEED_ENUM_SLOWER_THAN_EXPECTED",
  "DELIVERY_SPEED_ENUM_MUCH_SLOWER_THAN_EXPECTED",
] as const;

export const PACKAGING_VALUES = [
  "PACKAGING_CONDITION_ENUM_DAMAGED",
  "PACKAGING_CONDITION_ENUM_ACCEPTABLE",
  "PACKAGING_CONDITION_ENUM_GOOD",
  "PACKAGING_CONDITION_ENUM_EXCELLENT",
] as const;

export const PRODUCT_RATING_VALUES = [
  "PRODUCT_RATING_ENUM_POOR",
  "PRODUCT_RATING_ENUM_FAIR",
  "PRODUCT_RATING_ENUM_GOOD",
  "PRODUCT_RATING_ENUM_VERY_GOOD",
  "PRODUCT_RATING_ENUM_EXCELLENT",
] as const;

export const FIT_SCALE_VALUES = [
  "FIT_SCALE_ENUM_RUNS_SMALL",
  "FIT_SCALE_ENUM_SLIGHTLY_SMALL",
  "FIT_SCALE_ENUM_TRUE_TO_SIZE",
  "FIT_SCALE_ENUM_SLIGHTLY_LARGE",
  "FIT_SCALE_ENUM_RUNS_LARGE",
] as const;

function inConst<T extends readonly string[]>(values: T, v: string): v is T[number] {
  return (values as readonly string[]).includes(v);
}

export function buildOrderReviewFormSchema(
  required: string,
  itemCount: number,
) {
  const enumString = <T extends readonly string[]>(values: T) =>
    z
      .string()
      .min(1, required)
      .refine((v): v is T[number] => inConst(values, v), required);

  const itemRow = z.object({
    orderItemId: z.number().int().positive(),
    rating: enumString(PRODUCT_RATING_VALUES),
    fitRating: enumString(FIT_SCALE_VALUES),
    /** Optional in UI until shopper taps YES/NO; omitted → false on submit. */
    recommend: z.boolean().optional(),
  });

  return z.object({
    orderReview: z.object({
      deliveryRating: enumString(DELIVERY_SPEED_VALUES),
      packagingRating: enumString(PACKAGING_VALUES),
      sophisticationRating: enumString(PRODUCT_RATING_VALUES),
      reviewText: z.string().max(2000).optional(),
    }),
    itemReviews: z.array(itemRow).length(itemCount),
  });
}

export type OrderReviewFormInput = z.input<
  ReturnType<typeof buildOrderReviewFormSchema>
>;
export type OrderReviewFormValues = z.infer<
  ReturnType<typeof buildOrderReviewFormSchema>
>;
