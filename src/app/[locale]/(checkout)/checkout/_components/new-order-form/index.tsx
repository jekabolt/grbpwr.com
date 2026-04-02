"use client";

import React, { useRef } from "react";
import { currencySymbols } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { formatPrice } from "@/lib/currency";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import ContactFieldsGroup from "./contact-fields-group";
import { useAutoGroupOpen } from "./hooks/useAutoGroupOpen";
import { useCheckoutEffects } from "./hooks/useCheckout";
import { useCheckoutFormAnalytics } from "./hooks/useCheckoutFormAnalytics";
import { useCheckoutSubmit } from "./hooks/useCheckoutSubmit";
import { useComplimentaryShippingToast } from "./hooks/useComplimentaryShippingToast";
import { useOrderPersistence } from "./hooks/useOrderPersistence";
import { useValidatedOrder } from "./hooks/useValidatedOrder";
import { MobileOrderSummary } from "./mobile-order-summary";
import { OrderProducts } from "./order-products";
import PaymentFieldsGroup from "./payment-fields-group";
import { PriceSummary } from "./price-summary";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import ShippingFieldsGroup from "./shipping-fields-group";

type NewOrderFormProps = {
  onAmountChange: (amount: number) => void;
};

export default function NewOrderForm({ onAmountChange }: NewOrderFormProps) {
  const { currentCountry } = useTranslationsStore((state) => state);
  const { products, totalPrice, validatedCurrency } = useCart((s) => s);

  const formRef = useRef<HTMLFormElement>(null);
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
    showComplimentaryToast,
    complimentaryToastMessage,
    complimentaryToastOpen,
    setComplimentaryToastOpen,
  } = useComplimentaryShippingToast(order, orderCurrency);

  const {
    orderModifiedToastOpen,
    toastMessage,
    setOrderModifiedToastOpen,
    setToastMessage,
  } = useCheckoutEffects({
    order,
    products,
    form,
    countryCode: currentCountry.countryCode || "",
    onAmountChange,
    handleFormChange,
  });

  const {
    loading,
    isPaymentElementComplete,
    paymentMethod,
    isPaymentFieldsValid,
    setIsPaymentElementComplete,
    handleValidSubmit,
    handleSubmitInvalid,
  } = useCheckoutSubmit({
    form,
    order,
    orderCurrency,
    stripe,
    elements,
    contactRef: contactRef as React.RefObject<HTMLDivElement | null>,
    shippingRef: shippingRef as React.RefObject<HTMLDivElement | null>,
    paymentRef: paymentRef as React.RefObject<HTMLDivElement | null>,
    fillRequiredFieldsMessage: tToaster("fill_required_fields"),
    paymentFailedMessage: tToaster("payment_failed"),
    resolveToasterMessage: tToaster,
    isGroupOpen,
    handleGroupToggle,
    validateItems,
    clearFormData,
    setToastMessage,
    setOrderModifiedToastOpen,
  });

  useCheckoutFormAnalytics({
    formRef,
    products,
    isPaymentElementComplete,
    paymentMethod,
  });

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleValidSubmit, handleSubmitInvalid)}
          className="relative space-y-14 lg:space-y-0"
        >
          <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
            <div className="block lg:hidden">
              <MobileOrderSummary
                form={form}
                order={order}
                validatedProducts={order?.validItems}
                orderCurrency={orderCurrency}
                disabled={loading}
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
                  order={order}
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
                  showPaymentError={
                    (form.formState.isSubmitted ||
                      form.formState.submitCount > 0) &&
                    !isPaymentFieldsValid &&
                    paymentMethod === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"
                  }
                />
              </div>
            </div>
            <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
              <div className="hidden space-y-8 lg:block">
                <Text
                  variant="uppercase"
                  className={cn("", { "text-textInactiveColor": loading })}
                >
                  {t("order summary")}
                </Text>
                <OrderProducts
                  validatedProducts={order?.validItems}
                  currencyKey={orderCurrency}
                  disabled={loading}
                  disableProductLinks
                />
                <div
                  className={cn("space-y-8", {
                    "text-textInactiveColor": loading,
                  })}
                >
                  <PromoCode
                    freeShipmentCarrierId={2}
                    form={form}
                    loading={loading}
                    validateItems={validateItems}
                    currency={
                      orderCurrency || currentCountry.currencyKey || "EUR"
                    }
                  />
                  <PriceSummary
                    form={form}
                    order={order}
                    orderCurrency={orderCurrency}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="main"
                size="lg"
                className="w-full uppercase"
                disabled={loading}
                loading={loading}
                loadingType="order-processing"
                analyticsButtonId="place_order"
              >
                {`${t("place order")} ${formatPrice(order?.totalSale?.value ?? totalPrice ?? 0, orderCurrency || validatedCurrency || "EUR", currencySymbols[orderCurrency || validatedCurrency || "EUR"])}`}
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
      {showComplimentaryToast && complimentaryToastMessage && (
        <SubmissionToaster
          open={complimentaryToastOpen}
          message={complimentaryToastMessage}
          onOpenChange={(open) => !open && setComplimentaryToastOpen(false)}
          duration={Infinity}
        />
      )}
    </>
  );
}
