"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { currencySymbols } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { submitNewOrder } from "@/lib/checkout/order-service";
import { confirmStripePayment } from "@/lib/checkout/stripe-service";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import ContactFieldsGroup from "./contact-fields-group";
import { useAutoGroupOpen } from "./hooks/useAutoGroupOpen";
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
  const router = useRouter();
  const { countryCode } = useTranslationsStore((state) => state.currentCountry);
  const { clearCart, products } = useCart((s) => s);
  const { selectedCurrency } = useCurrency((state) => state);
  const { handlePurchaseEvent } = useCheckoutAnalytics({});

  const [loading, setLoading] = useState(false);
  const [isPaymentElementComplete, setIsPaymentElementComplete] =
    useState(false);
  const [orderModifiedToastOpen, setOrderModifiedToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "you order is has been modified",
  );
  const lastValidatedCountRef = useRef<number | null>(null);

  const t = useTranslations("checkout");
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...defaultData, country: countryCode },
  });

  const { order, validateItems } = useValidatedOrder(form);
  const { clearFormData } = useOrderPersistence(form);
  const { isGroupOpen, handleGroupToggle, isGroupDisabled, handleFormChange } =
    useAutoGroupOpen(form);

  useEffect(() => {
    // Check if cart is empty OR validation returned no valid items - redirect to main page
    const shouldRedirect =
      products.length === 0 ||
      (order?.validItems?.length === 0 &&
        lastValidatedCountRef.current !== null);

    if (shouldRedirect) {
      setToastMessage("cart outdated");
      setOrderModifiedToastOpen(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
      return;
    }

    if (!order?.validItems) return;

    const currentCount = order.validItems.reduce(
      (sum, item) => sum + (item.orderItem?.quantity || 0),
      0,
    );

    if (
      lastValidatedCountRef.current !== null &&
      currentCount !== lastValidatedCountRef.current
    ) {
      setToastMessage("you order is has been modified");
      setOrderModifiedToastOpen(true);
    }

    lastValidatedCountRef.current = currentCount;
  }, [order?.validItems, products.length, router]);

  useEffect(() => {
    if (order?.totalSale?.value) {
      onAmountChange(Math.round(parseFloat(order.totalSale.value)));
    }
  }, [order?.totalSale?.value, onAmountChange]);

  useEffect(() => {
    if (countryCode && !form.getValues("country")) {
      form.setValue("country", countryCode, { shouldValidate: true });
    }
  }, [countryCode, form]);

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      handleFormChange(name);
    });
    return () => subscription.unsubscribe();
  }, [form, handleFormChange]);

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
        selectedCurrency,
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
          window.location.href = `/order/${paymentResult.orderUuid}/${window.btoa(data.email)}`;
          return;
        }

        console.error("Payment confirmation failed:", paymentResult.error);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting new order:", error);
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
                {`${t("place order")} ${currencySymbols[selectedCurrency || "EUR"]}${order?.totalSale?.value || ""}`}
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
