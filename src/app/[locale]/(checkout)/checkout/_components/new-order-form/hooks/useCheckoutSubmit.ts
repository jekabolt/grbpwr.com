import { RefObject, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import type { Stripe, StripeElements } from "@stripe/stripe-js";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { pushUserIdToDataLayer, waitForAnalytics } from "@/lib/analitycs/utils";
import { getValidationErrorToastKey } from "@/lib/cart/validate-cart-items";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { submitNewOrder } from "@/lib/checkout/order-service";
import { confirmStripePayment } from "@/lib/checkout/stripe-service";
import { CHECKOUT_ERROR_CITY_COUNTRY, LANGUAGE_ID_TO_LOCALE } from "@/constants";
import type { ValidateOrderItemsInsertResponse, common_OrderItem } from "@/api/proto-http/frontend";
import type { OpenGroups } from "./constants";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { CheckoutData } from "../schema";
import { mapFormFieldToOrderDataFormat } from "../utils";
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
  isGroupOpen: (group: OpenGroups) => boolean;
  handleGroupToggle: (group: OpenGroups) => void;
  validateItems: (shipmentCarrierId?: string) => Promise<ValidateOrderItemsInsertResponse | null | undefined>;
  clearFormData: () => void;
  setToastMessage: (msg: string) => void;
  setOrderModifiedToastOpen: (open: boolean) => void;
  fillRequiredFieldsMessage: string;
  paymentFailedMessage: string;
  resolveToasterMessage: (key: string) => string;
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
  isGroupOpen,
  handleGroupToggle,
  validateItems,
  clearFormData,
  setToastMessage,
  setOrderModifiedToastOpen,
  fillRequiredFieldsMessage,
  paymentFailedMessage,
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

  const scrollToFirstError = (errors: typeof form.formState.errors) => {
    if (errors.email || errors.termsOfService || errors.subscribe) {
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!isGroupOpen("contact" as OpenGroups)) handleGroupToggle("contact" as OpenGroups);
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
      shippingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!isGroupOpen("shipping" as OpenGroups)) handleGroupToggle("shipping" as OpenGroups);
      return;
    }
    if (
      errors.paymentMethod ||
      errors.billingAddressIsSameAsAddress ||
      errors.billingAddress ||
      !isPaymentFieldsValid
    ) {
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!isGroupOpen("payment" as OpenGroups)) handleGroupToggle("payment" as OpenGroups);
    }
  };

  const handleSubmitInvalid = (errors: typeof form.formState.errors) => {
    setToastMessage(fillRequiredFieldsMessage);
    setOrderModifiedToastOpen(true);
    scrollToFirstError(errors);

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      handleFormError(errorFields);
    }
  };

  const handleValidSubmit = async (data: CheckoutData) => {
    if (!isPaymentFieldsValid) {
      setToastMessage(fillRequiredFieldsMessage);
      setOrderModifiedToastOpen(true);
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!isGroupOpen("payment" as OpenGroups)) handleGroupToggle("payment" as OpenGroups);
      return;
    }

    if (typeof window !== "undefined") {
      const shipOk = await verifyCityInCountry(data.city, data.country);
      if (!shipOk) {
        form.setError("city", { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY });
        setToastMessage(fillRequiredFieldsMessage);
        setOrderModifiedToastOpen(true);
        scrollToFirstError({
          city: { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY },
        } as typeof form.formState.errors);
        handleFormError(["city"]);
        return;
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
          setToastMessage(fillRequiredFieldsMessage);
          setOrderModifiedToastOpen(true);
          scrollToFirstError({
            billingAddress: {
              city: { type: "manual", message: CHECKOUT_ERROR_CITY_COUNTRY },
            },
          } as typeof form.formState.errors);
          handleFormError(["billingAddress.city"]);
          return;
        }
      }
    }

    await onSubmit(data);
  };

  const onSubmit = async (data: CheckoutData) => {
    if (!stripe || !elements) return;

    handleFormSubmit();

    setLoading(true);

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

      if (!newOrderResponse.ok) {
        setLoading(false);
        return;
      }

      const paymentType = newOrderResponse.order?.payment?.paymentMethod;
      const clientSecret =
        response?.clientSecret || newOrderResponse.order?.payment?.clientSecret;
      const orderUuid = newOrderResponse.order?.orderUuid;

      if (
        paymentType === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" &&
        clientSecret &&
        orderUuid
      ) {
        const country = currentCountry.countryCode?.toLowerCase() || "gb";
        const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
        const encodedEmail = window.btoa(data.email);
        const returnUrl = `${window.location.origin}/${country}/${locale}/checkout?order_uuid=${orderUuid}&email=${encodedEmail}`;

        try {
          sessionStorage.setItem(
            "pending_stripe_order",
            JSON.stringify({
              uuid: orderUuid,
              value: order?.totalSale?.value || "0",
              currency: orderCurrency || currentCountry.currencyKey || "EUR",
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
          await pushUserIdToDataLayer(data.email);
          clearCart();
          clearFormData();
          clearIdempotencyKey();
          sessionStorage.removeItem("pending_stripe_order");
          await waitForAnalytics();
          window.location.href = `/${country}/${locale}/order/${paymentResult.orderUuid}/${encodedEmail}?redirect_status=succeeded`;
          return;
        }

        handlePaymentFailed({
          error_code: paymentResult.error || "unknown",
          order_value: parseFloat(order?.totalSale?.value || "0"),
          currency: orderCurrency || currentCountry.currencyKey || "EUR",
          transaction_id: orderUuid,
        });

        setToastMessage(paymentFailedMessage);
        setOrderModifiedToastOpen(true);
        console.error("Payment confirmation failed:", paymentResult.error);
      } else if (orderUuid) {
        await pushUserIdToDataLayer(data.email);
        clearCart();
        clearFormData();
        clearIdempotencyKey();
        await waitForAnalytics();
        const country = currentCountry.countryCode?.toLowerCase() || "gb";
        const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
        window.location.href = `/${country}/${locale}/order/${orderUuid}/${window.btoa(data.email)}`;
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting new order:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : resolveToasterMessage(getValidationErrorToastKey(error));
      setToastMessage(message);
      setOrderModifiedToastOpen(true);
      setLoading(false);
    }
  };

  return {
    loading,
    isPaymentElementComplete,
    setIsPaymentElementComplete,
    paymentMethod,
    isPaymentFieldsValid,
    handleValidSubmit,
    handleSubmitInvalid,
  };
}
