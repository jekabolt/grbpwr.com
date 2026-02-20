"use client";

import { useState } from "react";
import { currencySymbols } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { resetCheckoutValidationState } from "@/lib/checkout/checkout-validation-state";
import { getValidationErrorToastKey } from "@/lib/cart/validate-cart-items";
import { submitNewOrder } from "@/lib/checkout/order-service";
import { confirmStripePayment } from "@/lib/checkout/stripe-service";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import ContactFieldsGroup from "./contact-fields-group";
import { useAutoGroupOpen } from "./hooks/useAutoGroupOpen";
import { useCheckoutEffects } from "./hooks/useCheckout";
import { useOrderPersistence } from "./hooks/useOrderPersistence";
import { useValidatedOrder } from "./hooks/useValidatedOrder";
import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderProducts } from "./order-products";
import PaymentFieldsGroup from "./payment-fields-group";
import { PriceSummary } from "./price-summary";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import ShippingFieldsGroup from "./shipping-fields-group";
import { mapFormFieldToOrderDataFormat } from "./utils";

type NewOrderFormProps = {
  onAmountChange: (amount: number) => void;
};

export default function NewOrderForm({ onAmountChange }: NewOrderFormProps) {
  const { currentCountry } = useTranslationsStore((state) => state);
  const { products, clearCart } = useCart((s) => s);

  const { handlePurchaseEvent } = useCheckoutAnalytics();

  const [loading, setLoading] = useState(false);
  const [isPaymentElementComplete, setIsPaymentElementComplete] =
    useState(false);

  const t = useTranslations("checkout");
  const tToaster = useTranslations("toaster");
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...defaultData, country: currentCountry.countryCode },
  });

  const { order, validateItems } = useValidatedOrder(form);
  const { clearFormData } = useOrderPersistence(form);
  const { isGroupOpen, handleGroupToggle, isGroupDisabled, handleFormChange } =
    useAutoGroupOpen(form);
  const {
    orderModifiedToastOpen,
    setOrderModifiedToastOpen,
    setToastMessage,
    toastMessage,
  } = useCheckoutEffects({
      order,
      products,
      loading,
      form,
      countryCode: currentCountry.countryCode || "",
      onAmountChange,
      handleFormChange,
    });

  const paymentMethod = form.watch("paymentMethod");
  const isPaymentFieldsValid =
    paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" ||
    isPaymentElementComplete;

  const onSubmit = async (data: CheckoutData) => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const response = await validateItems();
      const newOrderData = mapFormFieldToOrderDataFormat(
        data,
        response?.validItems?.map((i) => i.orderItem!) || [],
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
        const paymentResult = await confirmStripePayment({
          stripe,
          elements,
          clientSecret,
          orderUuid,
          email: data.email,
          country: data.country,
        });

        if (paymentResult.success) {
          handlePurchaseEvent(paymentResult.orderUuid);
          clearCart();
          clearFormData();
          clearIdempotencyKey();
          resetCheckoutValidationState();
          window.location.href = `/order/${paymentResult.orderUuid}/${window.btoa(data.email)}`;
          return;
        }

        console.error("Payment confirmation failed:", paymentResult.error);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting new order:", error);
      const toastKey = getValidationErrorToastKey(error);
      setToastMessage(tToaster(toastKey));
      setOrderModifiedToastOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-14 lg:space-y-0"
        >
          <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
            <div className="block lg:hidden">
              <MobileOrderSummary
                form={form}
                order={order}
                validatedProducts={order?.validItems}
              />
            </div>
            <div className="space-y-10 lg:space-y-16">
              <ContactFieldsGroup
                loading={loading}
                isOpen={isGroupOpen("contact")}
                onToggle={() => handleGroupToggle("contact")}
                disabled={isGroupDisabled("contact")}
              />
              <ShippingFieldsGroup
                loading={loading}
                validateItems={validateItems}
                isOpen={isGroupOpen("shipping")}
                onToggle={() => handleGroupToggle("shipping")}
                disabled={isGroupDisabled("shipping")}
              />
              <PaymentFieldsGroup
                loading={loading}
                form={form}
                validateItems={validateItems}
                isOpen={isGroupOpen("payment")}
                onToggle={() => handleGroupToggle("payment")}
                disabled={isGroupDisabled("payment")}
                onPaymentElementChange={setIsPaymentElementComplete}
              />
            </div>
            <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
              <div className="hidden space-y-8 lg:block">
                <Text variant="uppercase">{t("order summary")}</Text>

                <OrderProducts validatedProducts={order?.validItems} />

                <div className="space-y-8">
                  <PromoCode
                    freeShipmentCarrierId={2}
                    form={form}
                    loading={loading}
                    validateItems={validateItems}
                  />
                  <PriceSummary form={form} order={order} />
                </div>
              </div>
              <Button
                variant="main"
                size="lg"
                className="w-full uppercase"
                disabled={
                  !form.formState.isValid || !isPaymentFieldsValid || loading
                }
                loading={loading}
                loadingType="order-processing"
              >
                {`${t("place order")} ${currencySymbols[currentCountry.currencyKey || "EUR"]}${order?.totalSale?.value || ""}`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={orderModifiedToastOpen}
        message={toastMessage}
        onOpenChange={setOrderModifiedToastOpen}
      />
    </>
  );
}
