"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { common_OrderNew } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";

import ContactFieldsGroup from "./contact-fields-group";
import { useValidatedOrder } from "./hooks/useValidatedOrder";
import { OrderProducts } from "./order-products";
import PaymentFieldsGroup from "./payment-fields-group";
import { PriceSummary } from "./price-summary";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import ShippingFieldsGroup from "./shipping-fields-group";
import { mapFormFieldToOrderDataFormat } from "./utils";

async function submitNewOrder(newOrderData: common_OrderNew) {
  console.log("order data: ", {
    order: newOrderData,
  });

  try {
    const submitOrderResponse = await serviceClient.SubmitOrder({
      order: newOrderData,
    });

    //     ok: true,
    // order: {
    //   orderUuid: '4cfffa6a-a064-4cf6-ba31-0b46ab3cabfd',
    //   orderStatus: 'ORDER_STATUS_ENUM_PLACED',
    //   expiredAt: '2024-10-04T15:05:03.976425673Z',
    //   payment: {
    //     paymentMethod: 'PAYMENT_METHOD_NAME_ENUM_CARD_TEST',
    //     transactionId: '',
    //     transactionAmount: [Object],
    //     transactionAmountPaymentCurrency: [Object],
    //     payer: '',
    //     payee: '',
    //     clientSecret: 'pi_3Q6D40P97IsmiR4D1YQn5HOY_secret_egyt4YfOeoR1IlpFPawNCcQ4M',
    //     isTransactionDone: false
    //   }

    const creditCardPaymentMethod =
      submitOrderResponse.payment?.paymentMethod ===
        "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" ||
      submitOrderResponse.payment?.paymentMethod ===
        "PAYMENT_METHOD_NAME_ENUM_CARD";
    const shouldProcessStripePayment =
      creditCardPaymentMethod && submitOrderResponse.payment?.clientSecret;

    if (shouldProcessStripePayment) {
      const stripeClientSecret = submitOrderResponse.payment?.clientSecret;
    }

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

export default function NewOrderForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const clearCart = useCart((cart) => cart.clearCart);

  const defaultValues = {
    ...defaultData,
    // promoCustomConditions: {
    //   totalSale: order?.totalSale,
    //   subtotal: order?.subtotal,
    //   promo: order?.promo,
    // },
  };
  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  const { order, validateItems } = useValidatedOrder(form);

  const onSubmit = async (data: CheckoutData) => {
    const response = await validateItems();

    const newOrderData = mapFormFieldToOrderDataFormat(
      data,
      response?.validItems?.map((i) => i.orderItem!) || [],
    );

    try {
      console.log("submit order");
      const newOrderResponse = await submitNewOrder(newOrderData);
      console.log("submit order finish");

      if (newOrderResponse.ok) {
        clearCart();

        const paymentType = newOrderResponse.order?.payment?.paymentMethod;
        switch (paymentType) {
          case "PAYMENT_METHOD_NAME_ENUM_USDT_TRON":
          case "PAYMENT_METHOD_NAME_ENUM_USDT_SHASTA":
            router.push(`/payment/${newOrderResponse.order?.orderUuid}/crypto`);
            break;
          case "PAYMENT_METHOD_NAME_ENUM_CARD_TEST":
            const clientSecret = newOrderResponse.order?.payment?.clientSecret;

            // case "PAYMENT_METHOD_NAME_ENUM_CARD":
            router.push(
              `/payment/${newOrderResponse.order?.orderUuid}/card?clientSecret=${clientSecret}`,
            );
            break;
        }
      }

      console.log("finish and doesnt redirect");
    } catch (error) {
      console.error("Error submitting new order:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-28">
          <div className="space-y-10 lg:space-y-16">
            <ContactFieldsGroup loading={loading} />
            <ShippingFieldsGroup
              loading={loading}
              validateItems={validateItems}
            />
            <PaymentFieldsGroup loading={loading} />
          </div>
          <div className="space-y-8">
            <Text variant="uppercase">Order summary</Text>

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
            <Button variant={"main"} size={"lg"} className="w-full">
              pay
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
