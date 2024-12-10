"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  common_OrderNew,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import { FormContainer } from "@/components/ui/form/form-container";

import StripeSecureCardForm from "../StripeSecureCardForm";
import AddressFields from "./AddressFields";
import ContactFieldsGroup from "./contact-fields-group";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema } from "./schema";
import { mapFormFieldToOrderDataFormat } from "./utils";

// import { clearCartProducts } from "@/features/cart/action";

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
  const [newOrderStripeToken, setNewOrderStripeToken] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const { dictionary } = useDataContext();
  const router = useRouter();

  const defaultValues = {
    // ...defaultData,
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

  const billingAddressIsSameAsAddress = form.watch(
    "billingAddressIsSameAsAddress",
  );
  const paymentMethod = form.watch("paymentMethod");
  const promoCode = form.watch("promoCode");
  const shipmentCarrierId = form.watch("shipmentCarrierId");

  const onSubmit = async (data: CheckoutData) => {
    const response = await validateItemsAndUpdateCookie();

    const newOrderData = mapFormFieldToOrderDataFormat(
      data,
      response?.validItems?.map((i) => i.orderItem!) || [],
    );

    try {
      console.log("submit order");
      const newOrderResponse = await submitNewOrder(newOrderData);
      console.log("submit order finish");

      if (newOrderResponse.order?.payment?.clientSecret) {
        // todo: change flow
        setNewOrderStripeToken(
          newOrderResponse.order?.payment?.clientSecret || "",
        );

        console.log("new clientSecret");

        return;
      } else {
        // if (newOrderResponse.ok) {
        //   console.log("submit new order response on the client", data);
        //   router.replace(`/invoice/${newOrderResponse.order?.orderUuid}`);
        // } else {
        //   console.log("error submitting new order");
        //   router.push("/cart");
        // }
      }

      console.log("finish and doesnt redirect");
    } catch (error) {
      console.error("Error submitting new order:", error);
    }
  };

  const validateItemsAndUpdateCookie = async (
    customShipmentCarrierId?: string,
  ) => {
    const items = orderData?.validItems?.map((i) => ({
      productId: i.orderItem?.productId,
      quantity: i.orderItem?.quantity,
      sizeId: i.orderItem?.sizeId,
    }));

    if (!items || items?.length === 0) return null;

    const response = await serviceClient.ValidateOrderItemsInsert({
      items,
      promoCode,
      shipmentCarrierId: parseInt(customShipmentCarrierId || shipmentCarrierId),
    });

    setOrderData(response);

    if (response.hasChanged && response.validItems) {
      // updateCookieCart(response.validItems);
    }

    return response;
  };

  return (
    <>
      <FormContainer
        form={form}
        onSubmit={onSubmit}
        footerSide="right"
        submitButton={<Button>pay</Button>}
      >
        <div>
          <ContactFieldsGroup form={form} loading={loading} />

          <div className="space-y-4">
            <h2 className="mb-8 text-lg">shipping address</h2>
            <AddressFields control={form.control} loading={loading} />
          </div>

          <div className="space-y-4">
            <h2 className="mb-8 text-lg">shipping method</h2>

            <RadioGroupField
              control={form.control}
              loading={loading}
              name="shipmentCarrierId"
              onChange={validateItemsAndUpdateCookie}
              // label="shippingMethod"
              // @ts-ignore
              items={dictionary?.shipmentCarriers?.map((c) => ({
                label: c.shipmentCarrier?.carrier || "",
                value: c.id + "" || "",
              }))}
            />
          </div>
          <div className="space-y-4">
            <h2 className="mb-8 text-lg">billing address</h2>
            <p className="mb-2 text-sm">
              Select the address that matches your card or payment method
            </p>
            <CheckboxField
              control={form.control}
              name="billingAddressIsSameAsAddress"
              label="Same as shipping address"
            />

            {!billingAddressIsSameAsAddress && (
              <AddressFields
                prefix="billingAddress"
                control={form.control}
                loading={loading}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="mb-8 text-lg">payment</h2>

            <RadioGroupField
              control={form.control}
              loading={loading}
              name="paymentMethod"
              items={
                dictionary?.paymentMethods?.map((p) => ({
                  label: p.name as string,
                  value: p.name as string,
                })) || []
              }
            />

            {/* {(paymentMethod === "PAYMENT_METHOD_NAME_ENUM_CARD" ||
              paymentMethod === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST") && (
              <div>
                <h1 className="text-9xl font-bold">stripe elements</h1>
                <InputMaskedField
                  control={form.control}
                  name="creditCard.number"
                  label="card number:"
                  mask={"dddd dddd dddd dddd"}
                  placeholder="4242 4242 4242 4242"
                />
                <InputField
                  control={form.control}
                  name="creditCard.fullName"
                  label="name on card:"
                  placeholder="James Bond"
                />
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <InputMaskedField
                      control={form.control}
                      name="creditCard.expirationDate"
                      label="expiration date:"
                      mask={"__/__"}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputMaskedField
                      control={form.control}
                      name="creditCard.cvc"
                      label="security code:"
                      mask={"___"}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )} */}
          </div>

          <div className="space-y-4">
            <h2 className="mb-8 text-lg">remember me</h2>
            <CheckboxField
              control={form.control}
              name="rememberMe"
              label="Save my information for a faster checkouts"
            />
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <h2 className="text-lg">Order summary</h2>
            {/* ПОМЕНЯТЬ ВСЕ ЦЕН НА ЗНАЧЕНИЯ ФОРМЫ, тк иначе сложно обновлять значения независимо из разных мест */}
            <PromoCode
              freeShipmentCarrierId={2}
              control={form.control}
              loading={loading}
              validateItemsAndUpdateCookie={validateItemsAndUpdateCookie}
            />
            <div className="flex justify-between">
              <div>subtotal:</div>
              <div>{orderData?.subtotal?.value}</div>
            </div>
            <div className="flex justify-between">
              <div>shipping price:</div>
              {/* to-do pass shipping price */}
              <div>
                {orderData?.promo?.freeShipping
                  ? 0
                  : dictionary?.shipmentCarriers?.find(
                      (c) => c.id + "" === shipmentCarrierId,
                    )?.shipmentCarrier?.price?.value || 0}
              </div>
            </div>
            {!!orderData?.promo?.discount?.value && (
              <div className="flex justify-between">
                <div>discount:</div>
                <div>{orderData?.promo?.discount?.value}%</div>
              </div>
            )}
            <hr className="h-px bg-textColor" />
            <div className="flex justify-between">
              <div>grand total:</div>
              <div>{orderData?.totalSale?.value}</div>
            </div>
          </div>
        </div>
      </FormContainer>
      {newOrderStripeToken && (
        <>
          <h1 className="text-3xl text-green-600">{newOrderStripeToken}</h1>
          <StripeSecureCardForm clientSecret={newOrderStripeToken} />
        </>
      )}
    </>
  );
}
