import { RefObject, useEffect, useRef } from "react";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";

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

  useEffect(() => {
    if (isPaymentElementComplete && !paymentInfoSentRef.current) {
      paymentInfoSentRef.current = true;
      handlePaymentElementComplete();
    }
  }, [isPaymentElementComplete, handlePaymentElementComplete]);

  useEffect(() => {
    if (paymentMethod && paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_CARD_TEST") {
      handlePaymentMethodChange(paymentMethod);
    }
  }, [paymentMethod, handlePaymentMethodChange]);
}
