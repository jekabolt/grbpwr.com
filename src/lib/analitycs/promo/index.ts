import { pushCustomEvent } from "../utils";

export const sendCouponAppliedEvent = (
  couponCode: string,
  discountAmount: number,
  currency: string = "EUR"
): void => {
  pushCustomEvent("coupon_applied", {
    coupon_code: couponCode,
    discount_amount: discountAmount,
    currency: currency.toUpperCase(),
  });
};
