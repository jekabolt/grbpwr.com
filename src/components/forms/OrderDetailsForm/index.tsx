"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormContainer } from "@/components/ui/Form/FormContainer";
import InputField from "@/components/ui/Form/fields/InputField";
import CheckboxField from "@/components/ui/Form/fields/CheckboxField";
import RadioGroupField from "@/components/ui/Form/fields/RadioGroupField";
import AddressFields from "./AddressFields";

import { orderDetailsSchema, defaultData, OrderDetailsData } from "./schema";
import InputMaskedField from "@/components/ui/Form/fields/InputMaskedField";

export default function ConfirmOrderForm({
  initialData,
}: {
  initialData?: OrderDetailsData;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<OrderDetailsData>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: initialData || defaultData,
  });

  const billingAddressIsSameAsAddress = form.watch(
    "billingAddressIsSameAsAddress",
  );
  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (data: OrderDetailsData) => {
    // "use server";
    console.log("data:");
    console.log(data);
    // try {
    //   setLoading(true);
    //   const path = `${spaceId}/${resource}`;
    //   const apiBaseUrl = `${apiRoutes.spaces}/${path}`;
    //   const resourceUrl = `${routes.dashboard}/${path}`;

    //   if (initialData) {
    //     await axios.patch(`${apiBaseUrl}/${itemId}`, data);
    //   } else {
    //     await axios.post(apiBaseUrl, data);
    //   }

    //   router.refresh();
    //   router.push(resourceUrl);
    //   toast({ title: `Resource ${initialData ? "updated" : "created"}.` });
    // } catch (error) {
    //   toastError(error, "An error occurred while creating the resource.");
    // } finally {
    //   setLoading(false);
    // }
  };

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
    </FormContainer>
  );
}
