"use client";

import { useEffect, useState } from "react";
import type { common_OrderNew } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";

import ContactFieldsGroup from "./contact-fields-group";
import { useAutoGroupOpen } from "./hooks/useAutoGroupOpen";
import { useOrderPersistence } from "./hooks/useOrderPersistence";
import { useValidatedOrder } from "./hooks/useValidatedOrder";
import { OrderProducts } from "./order-products";
import PaymentFieldsGroup from "./payment-fields-group";
import { PriceSummary } from "./price-summary";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import ShippingFieldsGroup from "./shipping-fields-group";
import { mapFormFieldToOrderDataFormat } from "./utils";

async function submitNewOrder(
  newOrderData: common_OrderNew,
  paymentIntentId: string,
) {
  console.log("order data: ", {
    order: newOrderData,
  });

  try {
    const submitOrderResponse = await serviceClient.SubmitOrder({
      order: newOrderData,
      paymentIntentId: paymentIntentId,
    });

    if (!submitOrderResponse?.orderUuid) {
      console.log("no data to create order invoice");

      return {
        ok: false,
      };
    }

    console.log({
      ok: true,
      order: submitOrderResponse,
    });

    // clearCartProducts();

    return {
      ok: true,
      order: submitOrderResponse,
    };
  } catch (error) {
    console.error("Error submitting new order:", error);
    return {
      ok: false,
    };
  }
}

type NewOrderFormProps = {
  onAmountChange: (amount: number) => void;
};

export default function NewOrderForm({ onAmountChange }: NewOrderFormProps) {
  const { countryCode } = useTranslationsStore((state) => state.currentCountry);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPaymentElementComplete, setIsPaymentElementComplete] =
    useState<boolean>(false);
  const t = useTranslations("checkout");
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart((s) => s);
  const { selectedCurrency } = useCurrency((state) => state);
  const { handlePurchaseEvent } = useCheckoutAnalytics({});

  const defaultValues = {
    ...defaultData,
    country: countryCode,
  };
  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  const { order, validateItems } = useValidatedOrder(form);
  const { clearFormData } = useOrderPersistence(form);
  const { isGroupOpen, handleGroupToggle, isGroupDisabled, handleFormChange } =
    useAutoGroupOpen(form);

  useEffect(() => {
    if (order?.totalSale?.value) {
      const amountInCents = Math.round(parseFloat(order.totalSale.value));
      onAmountChange(amountInCents);
    }
  }, [order?.totalSale?.value, onAmountChange]);

  useEffect(() => {
    const currentCountry = form.getValues("country");
    if (countryCode && !currentCountry) {
      form.setValue("country", countryCode, { shouldValidate: true });
    }
  }, [countryCode, form, clearFormData]);

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      handleFormChange(name);
    });
    return () => subscription.unsubscribe();
  }, [form, handleFormChange]);

  // Watch payment method for reactive validation
  const paymentMethod = form.watch("paymentMethod");

  const isPaymentFieldsValid = () => {
    // If payment method is not card, payment element doesn't need to be complete
    if (paymentMethod !== "PAYMENT_METHOD_NAME_ENUM_CARD_TEST") {
      return true;
    }

    // For card payment, PaymentElement must be complete
    return isPaymentElementComplete;
  };

  const onSubmit = async (data: CheckoutData) => {
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const response = await validateItems();

    const newOrderData = mapFormFieldToOrderDataFormat(
      data,
      response?.validItems?.map((i) => i.orderItem!) || [],
      selectedCurrency,
    );
    try {
      console.log("submit order");
      const newOrderResponse = await submitNewOrder(
        newOrderData,
        response?.paymentIntentId || "",
      );
      console.log("submit order finish");

      if (newOrderResponse.ok) {
        const paymentType = newOrderResponse.order?.payment?.paymentMethod;
        const clientSecret =
          response?.clientSecret ||
          newOrderResponse.order?.payment?.clientSecret;
        const orderUuid = newOrderResponse.order?.orderUuid;

        switch (paymentType) {
          case "PAYMENT_METHOD_NAME_ENUM_CARD_TEST":
            if (
              !clientSecret ||
              typeof clientSecret !== "string" ||
              clientSecret.trim() === "" ||
              !orderUuid
            ) {
              console.error("Missing clientSecret or orderUuid", {
                clientSecret,
                orderUuid,
                fromValidation: response?.clientSecret,
                fromSubmit: newOrderResponse.order?.payment?.clientSecret,
              });
              setLoading(false);
              return;
            }

            const { error: submitError } = await elements.submit();

            if (submitError) {
              console.error("Error submitting payment elements:", submitError);
              setLoading(false);
              return;
            }

            const { error } = await stripe.confirmPayment({
              clientSecret,
              elements,
              confirmParams: {
                return_url: `${window.location.origin}/order/${orderUuid}/${window.btoa(data.email)}`,
                payment_method_data: {
                  billing_details: {
                    address: {
                      country: data.country,
                    },
                  },
                },
              },
              redirect: "if_required",
            });

            if (error) {
              console.error("Error confirming payment:", error.message);
              setLoading(false);
            } else {
              handlePurchaseEvent(orderUuid);
              clearCart();
              clearFormData();
              window.location.href = `/order/${orderUuid}/${window.btoa(data.email)}`;
            }
            return;
          // case "PAYMENT_METHOD_NAME_ENUM_CARD":
        }
      }
      console.log("finish and doesnt redirect");
      setLoading(false);
    } catch (error) {
      console.error("Error submitting new order:", error);
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
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
              isOpen={isGroupOpen("payment")}
              onToggle={() => handleGroupToggle("payment")}
              disabled={isGroupDisabled("payment")}
              onPaymentElementChange={setIsPaymentElementComplete}
            />
          </div>
          <div className="space-y-8 lg:sticky lg:top-16 lg:self-start">
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
            <Button
              variant="main"
              size="lg"
              className="w-full uppercase"
              disabled={
                !form.formState.isValid || !isPaymentFieldsValid() || loading
              }
              loading={loading}
              loadingType="order-processing"
            >
              {t("pay")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
