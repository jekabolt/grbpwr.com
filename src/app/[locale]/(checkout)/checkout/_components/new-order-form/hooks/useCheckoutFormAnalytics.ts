import { RefObject, useEffect, useRef } from "react";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";

import { isStripeCardPaymentMethod } from "../utils";

interface UseCheckoutFormAnalyticsProps {
  formRef: RefObject<HTMLFormElement | null>;
  products: unknown[];
  isPaymentElementComplete: boolean;
  paymentMethod: string | undefined;
}

export function useCheckoutFormAnalytics({
  formRef,
  products,
  isPaymentElementComplete,
  paymentMethod,
}: UseCheckoutFormAnalyticsProps) {
  const {
    handleFormStart,
    handleBeginCheckoutEvent,
    handlePaymentElementComplete,
    handlePaymentMethodChange,
  } = useCheckoutAnalytics();

  const checkoutEventFiredRef = useRef(false);
  const paymentInfoSentRef = useRef(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.addEventListener("focusin", handleFormStart, { once: true });
    return () => el.removeEventListener("focusin", handleFormStart);
  }, [formRef, handleFormStart]);

  useEffect(() => {
    if (!checkoutEventFiredRef.current && products.length > 0) {
      checkoutEventFiredRef.current = true;
      handleBeginCheckoutEvent();
    }
  }, [products, handleBeginCheckoutEvent]);

  // add_payment_info must fire exactly once, when payment info is genuinely
  // provided. For card (the pre-filled default method), the real signal is the
  // Stripe element reporting `complete` — not the method being pre-selected on
  // mount, which would fire prematurely and double-count alongside this event.
  useEffect(() => {
    if (isPaymentElementComplete && !paymentInfoSentRef.current) {
      paymentInfoSentRef.current = true;
      handlePaymentElementComplete();
    }
  }, [isPaymentElementComplete, handlePaymentElementComplete]);

  // Non-card methods fire on selection; card variants are handled by the
  // element-complete effect above. The shared `paymentInfoSentRef` guarantees a
  // single add_payment_info regardless of which path wins.
  useEffect(() => {
    if (
      paymentMethod &&
      !isStripeCardPaymentMethod(paymentMethod) &&
      !paymentInfoSentRef.current
    ) {
      paymentInfoSentRef.current = true;
      handlePaymentMethodChange(paymentMethod);
    }
  }, [paymentMethod, handlePaymentMethodChange]);
}
