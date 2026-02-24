"use client";

import { useRef, useState } from "react";
import { currencySymbols } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { getValidationErrorToastKey } from "@/lib/cart/validate-cart-items";
import { resetCheckoutValidationState } from "@/lib/checkout/checkout-validation-state";
import { clearIdempotencyKey } from "@/lib/checkout/idempotency-key";
import { submitNewOrder } from "@/lib/checkout/order-service";
import { confirmStripePayment } from "@/lib/checkout/stripe-service";
import { formatPrice } from "@/lib/currency";
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

  const contactRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("checkout");
  const tToaster = useTranslations("toaster");
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...defaultData, country: currentCountry.countryCode },
  });

  const { order, validateItems, orderCurrency } = useValidatedOrder(form);
  const { clearFormData } = useOrderPersistence(
    form,
    currentCountry.countryCode,
  );
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

  const handlePlaceOrderClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    // Check if form is valid and payment element is complete
    const isValid = form.formState.isValid && isPaymentFieldsValid;

    if (!isValid) {
      e.preventDefault();

      // Trigger validation on all fields to show errors
      await form.trigger();

      // Show toast notification
      setToastMessage(tToaster("fill_required_fields"));
      setOrderModifiedToastOpen(true);

      // Find first error field and scroll to its section
      const errors = form.formState.errors;

      // Check contact fields
      if (errors.email || errors.termsOfService || errors.subscribe) {
        contactRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (!isGroupOpen("contact")) {
          handleGroupToggle("contact");
        }
        return;
      }

      // Check shipping fields
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
        shippingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (!isGroupOpen("shipping")) {
          handleGroupToggle("shipping");
        }
        return;
      }

      // Check payment fields
      if (
        errors.paymentMethod ||
        errors.billingAddressIsSameAsAddress ||
        errors.billingAddress ||
        !isPaymentFieldsValid
      ) {
        paymentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (!isGroupOpen("payment")) {
          handleGroupToggle("payment");
        }
        return;
      }
    }
  };

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
      const message =
        error instanceof Error && error.message
          ? error.message
          : tToaster(getValidationErrorToastKey(error));
      setToastMessage(message);
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
                orderCurrency={orderCurrency}
              />
            </div>
            <div className="space-y-10 lg:space-y-16">
              <div ref={contactRef}>
                <ContactFieldsGroup
                  loading={loading}
                  isOpen={isGroupOpen("contact")}
                  onToggle={() => handleGroupToggle("contact")}
                  disabled={isGroupDisabled("contact") || loading}
                />
              </div>
              <div ref={shippingRef}>
                <ShippingFieldsGroup
                  loading={loading}
                  validateItems={validateItems}
                  isOpen={isGroupOpen("shipping")}
                  onToggle={() => handleGroupToggle("shipping")}
                  disabled={isGroupDisabled("shipping") || loading}
                />
              </div>
              <div ref={paymentRef}>
                <PaymentFieldsGroup
                  loading={loading}
                  form={form}
                  validateItems={validateItems}
                  isOpen={isGroupOpen("payment")}
                  onToggle={() => handleGroupToggle("payment")}
                  disabled={isGroupDisabled("payment") || loading}
                  onPaymentElementChange={setIsPaymentElementComplete}
                />
              </div>
            </div>
            <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
              <div className="hidden space-y-8 lg:block">
                <Text variant="uppercase">{t("order summary")}</Text>

                <OrderProducts
                  validatedProducts={order?.validItems}
                  currencyKey={orderCurrency}
                />

                <div className="space-y-8">
                  <PromoCode
                    freeShipmentCarrierId={2}
                    form={form}
                    loading={loading}
                    validateItems={validateItems}
                  />
                  <PriceSummary
                    form={form}
                    order={order}
                    orderCurrency={orderCurrency}
                  />
                </div>
              </div>
              <Button
                variant="main"
                size="lg"
                className="w-full uppercase"
                disabled={loading}
                loading={loading}
                loadingType="order-processing"
                onClick={handlePlaceOrderClick}
              >
                {`${t("place order")} ${formatPrice(order?.totalSale?.value || "0", orderCurrency || "EUR", currencySymbols[orderCurrency || "EUR"])}`}
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
