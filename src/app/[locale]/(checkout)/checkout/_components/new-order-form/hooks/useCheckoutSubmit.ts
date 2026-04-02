import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { RefObject, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { ValidateOrderItemsInsertResponse, common_OrderItem } from "@/api/proto-http/frontend";
import { CHECKOUT_ERROR_CITY_COUNTRY } from "@/constants";
import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { pushUserIdToDataLayer, waitForAnalytics } from "@/lib/analitycs/utils";
import { getValidationErrorToastKey } from "@/lib/cart/validate-cart-items";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { submitNewOrder } from "@/lib/checkout/order-service";
import { confirmStripePayment } from "@/lib/checkout/stripe-service";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import type { OpenGroups } from "./constants";

import { CheckoutData } from "../schema";
import {
  buildOrderConfirmationUrl,
  buildStripeCheckoutReturnUrl,
  mapFormFieldToOrderDataFormat,
} from "../utils";
import { verifyCityInCountry } from "../verify-city";

interface UseCheckoutSubmitProps {
  form: UseFormReturn<CheckoutData>;
  order: ValidateOrderItemsInsertResponse | undefined;
  orderCurrency: string | undefined;
  stripe: Stripe | null;
  elements: StripeElements | null;
  contactRef: RefObject<HTMLDivElement | null>;
  shippingRef: RefObject<HTMLDivElement | null>;
  paymentRef: RefObject<HTMLDivElement | null>;
  fillRequiredFieldsMessage: string;
  paymentFailedMessage: string;
  resolveToasterMessage: (key: string) => string;
  isGroupOpen: (group: OpenGroups) => boolean;
  handleGroupToggle: (group: OpenGroups) => void;
  validateItems: (shipmentCarrierId?: string) => Promise<ValidateOrderItemsInsertResponse | null | undefined>;
  clearFormData: () => void;
  setToastMessage: (msg: string) => void;
  setOrderModifiedToastOpen: (open: boolean) => void;
}

export function useCheckoutSubmit({
  form,
  order,
  orderCurrency,
  stripe,
  elements,
  contactRef,
  shippingRef,
  paymentRef,
  fillRequiredFieldsMessage,
  paymentFailedMessage,
  isGroupOpen,
  handleGroupToggle,
  validateItems,
  clearFormData,
  setToastMessage,
  setOrderModifiedToastOpen,
  resolveToasterMessage,
}: UseCheckoutSubmitProps) {
  const [loading, setLoading] = useState(false);
  const [isPaymentElementComplete, setIsPaymentElementComplete] = useState(false);
  const { currentCountry, languageId } = useTranslationsStore((state) => state);
  const { clearCart } = useCart((s) => s);
  const { handleFormSubmit, handleFormError, handlePaymentFailed } =
    useCheckoutAnalytics();

  const paymentMethod = form.watch("paymentMethod");
  const isPaymentFieldsValid =
    paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" ||
    isPaymentElementComplete;

  const focusGroup = (group: OpenGroups, ref: RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!isGroupOpen(group)) handleGroupToggle(group);
  };

  const showFillRequiredToast = () => {
    setToastMessage(fillRequiredFieldsMessage);
    setOrderModifiedToastOpen(true);
  };

  const scrollToFirstError = (errors: typeof form.formState.errors) => {
    if (errors.email || errors.termsOfService || errors.subscribe) {
      focusGroup("contact", contactRef);
      return;
    }
    if (
      errors.firstName ||
      errors.lastName ||
      errors.address ||
      errors.country ||
      errors.state ||
      errors.city ||
      errors.additionalAddress ||
      errors.company ||
      errors.phone ||
      errors.postalCode ||
      errors.shipmentCarrierId
    ) {
      focusGroup("shipping", shippingRef);
      return;
    }
    if (
      errors.paymentMethod ||
      errors.billingAddressIsSameAsAddress ||
      errors.billingAddress ||
      !isPaymentFieldsValid
    ) {
      focusGroup("payment", paymentRef);
    }
  };

  const handleSubmitInvalid = (errors: typeof form.formState.errors) => {
    showFillRequiredToast();
    scrollToFirstError(errors);

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) handleFormError(errorFields);
  };

  const assertShippingCities = async (data: CheckoutData): Promise<boolean> => {
    if (typeof window === "undefined") return true;

    if (!(await verifyCityInCountry(data.city, data.country))) {
      form.setError("city", { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY });
      showFillRequiredToast();
      scrollToFirstError({
        city: { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY },
      } as typeof form.formState.errors);
      handleFormError(["city"]);
      return false;
    }

    if (!data.billingAddressIsSameAsAddress && data.billingAddress) {
      const billOk = await verifyCityInCountry(
        data.billingAddress.city,
        data.billingAddress.country,
      );
      if (!billOk) {
        form.setError("billingAddress.city", {
          type: "manual",
          message: CHECKOUT_ERROR_CITY_COUNTRY,
        });
        showFillRequiredToast();
        scrollToFirstError({
          billingAddress: {
            city: { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY },
          },
        } as typeof form.formState.errors);
        handleFormError(["billingAddress.city"]);
        return false;
      }
    }

    return true;
  };

  const finalizeOrderAndRedirect = async (
    data: CheckoutData,
    orderUuid: string,
    options?: { redirectStatus?: "succeeded" },
  ) => {
    await pushUserIdToDataLayer(data.email);
    clearCart();
    clearFormData();
    clearIdempotencyKey();
    await waitForAnalytics();

    window.location.href = buildOrderConfirmationUrl({
      countryCode: currentCountry.countryCode,
      languageId,
      orderUuid,
      emailBase64: window.btoa(data.email),
      redirectStatus: options?.redirectStatus,
    });
  };

  const handleValidSubmit = async (data: CheckoutData) => {
    if (!isPaymentFieldsValid) {
      showFillRequiredToast();
      focusGroup("payment", paymentRef);
      return;
    }

    if (!(await assertShippingCities(data))) return;
    await onSubmit(data);
  };

  const onSubmit = async (data: CheckoutData) => {
    if (!stripe || !elements) return;

    handleFormSubmit();
    setLoading(true);

    let stripeOrderUuid: string | undefined;
    const orderCurrencyResolved = orderCurrency || currentCountry.currencyKey || "EUR";
    let redirecting = false;

    try {
      const response = await validateItems();
      const newOrderData = mapFormFieldToOrderDataFormat(
        data,
        response?.validItems?.map((i: common_OrderItem) => i.orderItem!) || [],
        currentCountry.currencyKey || "",
      );

      const newOrderResponse = await submitNewOrder(
        newOrderData,
        response?.paymentIntentId || "",
      );

      if (!newOrderResponse.ok) return;

      const paymentType = newOrderResponse.order?.payment?.paymentMethod;
      const clientSecret =
        response?.clientSecret || newOrderResponse.order?.payment?.clientSecret;
      const orderUuid = newOrderResponse.order?.orderUuid;

      const isCardTest =
        paymentType === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" &&
        Boolean(clientSecret && orderUuid);

      if (isCardTest && orderUuid && clientSecret) {
        stripeOrderUuid = orderUuid;

        const encodedEmail = window.btoa(data.email);
        const returnUrl = buildStripeCheckoutReturnUrl({
          origin: window.location.origin,
          countryCode: currentCountry.countryCode,
          languageId,
          orderUuid,
          emailBase64: encodedEmail,
        });

        try {
          sessionStorage.setItem(
            "pending_stripe_order",
            JSON.stringify({
              uuid: orderUuid,
              value: order?.totalSale?.value || "0",
              currency: orderCurrencyResolved,
            }),
          );
        } catch {
          // sessionStorage unavailable — analytics on failure will be skipped
        }

        const paymentResult = await confirmStripePayment({
          stripe,
          elements,
          clientSecret,
          orderUuid,
          email: data.email,
          country: data.country,
          returnUrl,
        });

        if (paymentResult.success) {
          sessionStorage.removeItem("pending_stripe_order");
          redirecting = true;
          await finalizeOrderAndRedirect(data, paymentResult.orderUuid, {
            redirectStatus: "succeeded",
          });
          return;
        }

        handlePaymentFailed({
          error_code: paymentResult.error || "unknown",
          order_value: parseFloat(order?.totalSale?.value || "0"),
          currency: orderCurrencyResolved,
          transaction_id: orderUuid,
        });

        setToastMessage(paymentFailedMessage);
        setOrderModifiedToastOpen(true);
        console.error("Payment confirmation failed:", paymentResult.error);
        return;
      }

      if (orderUuid) {
        redirecting = true;
        await finalizeOrderAndRedirect(data, orderUuid);
      }
    } catch (error) {
      console.error("Error submitting new order:", error);

      if (stripeOrderUuid) {
        handlePaymentFailed({
          error_code:
            error instanceof Error ? error.message : "stripe_exception",
          order_value: parseFloat(order?.totalSale?.value || "0"),
          currency: orderCurrencyResolved,
          transaction_id: stripeOrderUuid,
        });
        sessionStorage.removeItem("pending_stripe_order");
      }

      const message =
        error instanceof Error && error.message
          ? error.message
          : resolveToasterMessage(getValidationErrorToastKey(error));
      setToastMessage(message);
      setOrderModifiedToastOpen(true);
    } finally {
      if (!redirecting) setLoading(false);
    }
  };

  return {
    loading,
    isPaymentElementComplete,
    paymentMethod,
    isPaymentFieldsValid,
    setIsPaymentElementComplete,
    handleValidSubmit,
    handleSubmitInvalid,
  };
}
