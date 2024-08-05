"use client";

import { FormContainer } from "@/components/ui/Form/FormContainer";
import CheckboxField from "@/components/ui/Form/fields/CheckboxField";
import InputField from "@/components/ui/Form/fields/InputField";
import RadioGroupField from "@/components/ui/Form/fields/RadioGroupField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AddressFields from "./AddressFields";

import {
  SubmitOrderRequest,
  common_AddressInsert,
  common_BuyerInsert,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import InputMaskedField from "@/components/ui/Form/fields/InputMaskedField";
import { serviceClient } from "@/lib/api";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";

export default function NewOrderForm({
  initialData,
  orderItems,
  totalPrice,
}: {
  initialData?: CheckoutData;
  orderItems: common_OrderItemInsert[];
  totalPrice: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: initialData || defaultData,
  });

  const billingAddressIsSameAsAddress = form.watch(
    "billingAddressIsSameAsAddress",
  );
  const paymentMethod = form.watch("paymentMethod");

  console.log(paymentMethod);

  const onSubmit = async (data: CheckoutData) => {
    try {
      // todo: check if all items are in stock

      const response = await serviceClient.SubmitOrder(
        createSubmitOrderRequest(data),
      );
      console.log("Order submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  function createSubmitOrderRequest(data: CheckoutData): SubmitOrderRequest {
    const shippingAddress: common_AddressInsert = {
      street: data.address,
      houseNumber: "1", // common_AddressInsert will be changed to just have full address
      apartmentNumber: data.additionalAddress,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
    };

    const billingAddress: common_AddressInsert | undefined =
      data.billingAddressIsSameAsAddress
        ? shippingAddress
        : data.billingAddress
          ? {
              street: data.billingAddress.address,
              houseNumber: "1", // common_AddressInsert will be changed to just have full address
              apartmentNumber: data.billingAddress.additionalAddress,
              city: data.billingAddress.city,
              state: data.billingAddress.state,
              country: data.billingAddress.country,
              postalCode: data.billingAddress.postalCode,
            }
          : undefined;

    const buyer: common_BuyerInsert = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      receivePromoEmails: data.subscribe,
    };

    const order: common_OrderNew = {
      items: orderItems,
      shippingAddress,
      billingAddress,
      buyer,
      // TO-DO map payment method and carrier id from dictionary
      // paymentMethodId: mapPaymentMethod(data.paymentMethod),
      // shipmentCarrierId: mapShipmentCarrierId(data.shippingMethod),
      paymentMethodId: 1,
      shipmentCarrierId: 1,
      promoCode: data.promoCode, // Add promo code if applicable
    };

    return {
      order,
    };
  }

  return (
    <FormContainer
      form={form}
      initialData={initialData}
      onSubmit={onSubmit}
      loading={loading}
      className="space-y-8"
      ctaLabel="pay"
      footerSide="right"
    >
      <div className="space-y-4">
        <h2 className="mb-8 text-lg">contact</h2>
        <InputField
          control={form.control}
          loading={loading}
          name="email"
          label="email address:"
          type="email"
          placeholder="james.bond@example.com"
        />
        <InputField
          control={form.control}
          loading={loading}
          type="number"
          name="phone"
          label="phone number:"
          placeholder="James Bond"
        />
        <div className="space-y-2">
          <CheckboxField
            control={form.control}
            name="subscribe"
            label="email me with news and offers to our newsletter"
          />
          <CheckboxField
            control={form.control}
            name="termsOfService"
            label="i accept the privacy policy and terms & conditions"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="mb-8 text-lg">shipping address</h2>
        <AddressFields control={form.control} loading={loading} />
      </div>

      <div className="space-y-4">
        <h2 className="mb-8 text-lg">shipping method</h2>
        <RadioGroupField
          control={form.control}
          loading={loading}
          name="shippingMethod"
          // label="shippingMethod"
          items={[
            {
              label: "dhl standart",
              value: "dhl-standart",
            },
            {
              label: "dhl express",
              value: "dhl-express",
            },
          ]}
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
          items={[
            {
              label: "credit card",
              value: "card",
            },
            {
              label: "google pay",
              value: "googlePay",
            },
            {
              label: "apple pay",
              value: "applePay",
            },
            {
              label: "klarna",
              value: "klarna",
            },
            {
              label: "trx usdt",
              value: "trxUsdt",
            },
            {
              label: "eth",
              value: "eth",
            },
          ]}
        />

        {paymentMethod === "card" && (
          <>
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
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="mb-8 text-lg">remember me</h2>
        <CheckboxField
          control={form.control}
          name="rememberMe"
          label="Save my information for a faster checkouts"
        />
      </div>

      <div className="space-y-4">
        <PromoCode control={form.control} loading={loading} />
      </div>
    </FormContainer>
  );
}
