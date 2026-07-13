import { RefObject, useEffect } from "react";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";

import { isStripeCardPaymentMethod } from "../utils";

// begin_checkout / add_payment_info must fire once per checkout-start. A
// per-mount ref reset on every remount of the form (login steps, currency sync,
// dev StrictMode), firing ~10x/user. These module-level guards survive those
// remounts and reset only when the cart empties (post-purchase or full removal),
// so a genuinely new checkout fires again while remounts of the same one stay
// silent.
let beginCheckoutFired = false;
let addPaymentInfoFired = false;

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

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.addEventListener("focusin", handleFormStart, { once: true });
    return () => el.removeEventListener("focusin", handleFormStart);
  }, [formRef, handleFormStart]);

  useEffect(() => {
    if (products.length === 0) {
      // Cart drained (order placed or emptied) — arm the next checkout-start.
      beginCheckoutFired = false;
      addPaymentInfoFired = false;
      return;
    }
    if (beginCheckoutFired) return;
    beginCheckoutFired = true;
    handleBeginCheckoutEvent();
  }, [products, handleBeginCheckoutEvent]);

  // add_payment_info must fire exactly once, when payment info is genuinely
  // provided. For card (the pre-filled default method), the real signal is the
  // Stripe element reporting `complete` — not the method being pre-selected on
  // mount, which would fire prematurely and double-count alongside this event.
  useEffect(() => {
    if (isPaymentElementComplete && !addPaymentInfoFired) {
      addPaymentInfoFired = true;
      handlePaymentElementComplete();
    }
  }, [isPaymentElementComplete, handlePaymentElementComplete]);

  // Non-card methods fire on selection; card variants are handled by the
  // element-complete effect above. The shared `addPaymentInfoFired` guard
  // guarantees a single add_payment_info regardless of which path wins and
  // survives form remounts.
  useEffect(() => {
    if (
      paymentMethod &&
      !isStripeCardPaymentMethod(paymentMethod) &&
      !addPaymentInfoFired
    ) {
      addPaymentInfoFired = true;
      handlePaymentMethodChange(paymentMethod);
    }
  }, [paymentMethod, handlePaymentMethodChange]);
}
