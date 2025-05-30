"use client";

import { useFormContext } from "react-hook-form";

import { useDataContext } from "@/components/contexts/DataContext";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import { Tron } from "@/components/ui/icons/tron";
import { Text } from "@/components/ui/text";

import { paymentMethodNamesMap } from "./constants";
import FieldsGroupContainer from "./fields-group-container";
import { AddressFields } from "./shipping-fields-group";

type Props = {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function PaymentFieldsGroup({
  loading,
  isOpen,
  onToggle,
  disabled = false,
}: Props) {
  const { dictionary } = useDataContext();
  const { watch } = useFormContext();

  const billingAddressIsSameAsAddress = watch("billingAddressIsSameAsAddress");
  const paymentMethod = watch("paymentMethod");

  const allowedMethods =
    dictionary?.paymentMethods?.filter((v) => v.allowed) || [];

  const selectedMethod = allowedMethods.find((v) => v.name === paymentMethod);
  const selectedPaymentMethod = selectedMethod
    ? paymentMethodNamesMap[
        selectedMethod.name as keyof typeof paymentMethodNamesMap
      ]
    : undefined;

  const paymentMethodsItems = allowedMethods.map((v) => ({
    label: paymentMethodNamesMap[v.name as keyof typeof paymentMethodNamesMap],
    value: v.name,
    icon: v.name === "PAYMENT_METHOD_NAME_ENUM_USDT_TRON" && <Tron />,
  }));

  return (
    <FieldsGroupContainer
      stage="3/3"
      title="payment method"
      isOpen={isOpen}
      disabled={disabled}
      onToggle={onToggle}
      summary={selectedPaymentMethod && <Text>{selectedPaymentMethod}</Text>}
    >
      <RadioGroupField
        loading={loading}
        name="paymentMethod"
        items={paymentMethodsItems as any}
        disabled={disabled}
      />

      {/*оплата картой делается на отдельной странице*/}

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
          name="billingAddressIsSameAsAddress"
          label="same as shipping address"
          disabled={disabled}
        />
      </div>

      {!billingAddressIsSameAsAddress && (
        <AddressFields
          prefix="billingAddress"
          loading={loading}
          disabled={disabled}
        />
      )}
    </FieldsGroupContainer>
  );
}
