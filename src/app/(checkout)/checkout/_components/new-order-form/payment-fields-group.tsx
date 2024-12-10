"use client";

import type { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/DataContext";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import { Text } from "@/components/ui/text";

import { paymentMethodNamesMap } from "./constants";
import FieldsGroupContainer from "./fields-group-container";
import { AddressFields } from "./shipping-fields-group";

type Props = {
  loading: boolean;
  form: UseFormReturn<any>;
  validateItemsAndUpdateCookie: (shipmentCarrierId: string) => Promise<any>;
};

export default function ShippingFieldsGroup({
  loading,
  form,
  validateItemsAndUpdateCookie,
}: Props) {
  const { dictionary } = useDataContext();

  const { control, watch } = form;
  const billingAddressIsSameAsAddress = watch("billingAddressIsSameAsAddress");

  const paymentMethodsItems = dictionary?.paymentMethods
    ?.filter((v) => v.allowed)
    .map((v) => ({
      label:
        paymentMethodNamesMap[v.name as keyof typeof paymentMethodNamesMap],
      value: v.name,
    }));

  return (
    <FieldsGroupContainer stage="3/3" title="payment method">
      <RadioGroupField
        control={form.control}
        loading={loading}
        name="paymentMethod"
        onChange={validateItemsAndUpdateCookie}
        // @ts-ignore
        items={paymentMethodsItems}
      />

      {/* оплата картой делается на отдельной странице */}

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

      <Text variant="uppercase" component="h2">
        billing address
      </Text>

      <div className="space-y-2">
        <Text size="small">
          select the address that matches your card or payment method
        </Text>
        <CheckboxField
          control={control}
          name="billingAddressIsSameAsAddress"
          label="same as shipping address"
        />
      </div>

      {!billingAddressIsSameAsAddress && (
        <AddressFields
          prefix="billingAddress"
          control={control}
          loading={loading}
        />
      )}
    </FieldsGroupContainer>
  );
}
