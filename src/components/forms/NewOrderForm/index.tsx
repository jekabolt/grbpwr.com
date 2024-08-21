"use client";

import { FormContainer } from "@/components/ui/Form/FormContainer";
import CheckboxField from "@/components/ui/Form/fields/CheckboxField";
import InputField from "@/components/ui/Form/fields/InputField";
import RadioGroupField from "@/components/ui/Form/fields/RadioGroupField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AddressFields from "./AddressFields";

import type {
  common_Order,
  common_OrderNew,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import InputMaskedField from "@/components/ui/Form/fields/InputMaskedField";
import { useRouter } from "next/navigation";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import { mapFormFieldToOrderDataFormat } from "./utils";

export default function NewOrderForm({
  initialData,
  order,
  submitNewOrder,
  validateOrderItems,
}: {
  initialData?: CheckoutData;
  order?: ValidateOrderItemsInsertResponse;
  submitNewOrder: (
    newOrderData: common_OrderNew,
  ) => Promise<{ ok: boolean; order?: common_Order }>;
  validateOrderItems: (
    promoCode: string | undefined,
    shipmentCarrierId: number | undefined,
  ) => Promise<ValidateOrderItemsInsertResponse | undefined>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: initialData || defaultData,
  });

  const billingAddressIsSameAsAddress = form.watch(
    "billingAddressIsSameAsAddress",
  );
  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (data: CheckoutData) => {
    const newOrderData = mapFormFieldToOrderDataFormat(
      data,
      order?.validItems?.map((x) => x.orderItem!) || [],
    );

    try {
      const data = await submitNewOrder(newOrderData);
      console.log("submit new order response", data);
      console.log("New order submitted successfully");

      router.replace(`/invoices/crypto/${data.order?.uuid}`);
    } catch (error) {
      console.error("Error submitting new order:", error);
    }
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

      <div className="space-y-4">
        <h2 className="text-lg">Order summary</h2>
        <PromoCode control={form.control} loading={loading} />
        <div className="flex justify-between">
          <div>subtotal:</div>
          <div>{order?.subtotal?.value}</div>
        </div>
        <div className="flex justify-between">
          <div>shipping price:</div>
          {/* to-do pass shipping price */}
          <div>{order?.promo?.freeShipping ? 0 : 10}</div>
        </div>
        {!!order?.promo?.discount?.value && (
          <div className="flex justify-between">
            <div>discount:</div>
            <div>{order?.promo?.discount?.value}%</div>
          </div>
        )}
        <hr className="h-px bg-textColor" />
        <div className="flex justify-between">
          <div>grand total:</div>
          <div>{order?.totalSale?.value}</div>
        </div>
      </div>
    </FormContainer>
  );
}
