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
  common_OrderNew,
  SubmitOrderResponse,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { useHeroContext } from "@/components/contexts/HeroContext";
import InputMaskedField from "@/components/ui/Form/fields/InputMaskedField";
import { serviceClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PromoCode from "./PromoCode";
import { CheckoutData, checkoutSchema, defaultData } from "./schema";
import { mapFormFieldToOrderDataFormat } from "./utils";

export default function NewOrderForm({
  order,
  submitNewOrder,
  updateCookieCart,
}: {
  order?: ValidateOrderItemsInsertResponse;
  submitNewOrder: (
    newOrderData: common_OrderNew,
  ) => Promise<{ ok: boolean; order?: SubmitOrderResponse }>;
  updateCookieCart: (validItems: any[]) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(order);
  const { dictionary } = useHeroContext();
  const router = useRouter();

  const defaultValues = {
    ...defaultData,
    promoCustomConditions: {
      totalSale: order?.totalSale,
      subtotal: order?.subtotal,
      promo: order?.promo,
    },
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
      const newOrderResponse = await submitNewOrder(newOrderData);
      console.log("submit new order response", data);
      console.log("New order submitted successfully");

      router.replace(`/invoices/crypto/${newOrderResponse?.order?.orderUuid}`);
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
      toast("something has changed");
      updateCookieCart(response.validItems);
    }

    return response;
  };

  return (
    <FormContainer
      form={form}
      initialData={defaultValues}
      onSubmit={onSubmit}
      loading={loading}
      className="flex flex-col gap-8 md:flex-row"
      ctaLabel="pay"
      footerSide="right"
    >
      <div>
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

          {paymentMethod === "PAYMENT_METHOD_NAME_ENUM_CARD" && (
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
  );
}
