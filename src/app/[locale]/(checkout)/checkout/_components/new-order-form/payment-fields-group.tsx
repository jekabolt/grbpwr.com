"use client";

import { useEffect, useRef, useState } from "react";
import { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import { useFormContext, UseFormReturn } from "react-hook-form";

import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import PromoCode from "./PromoCode";
import { AddressFields } from "./shipping-fields-group";

type Props = {
  loading: boolean;
  isOpen: boolean;
  disabled?: boolean;
  form: UseFormReturn<any>;
  validateItems: () => Promise<ValidateOrderItemsInsertResponse | null>;
  onToggle: () => void;
  onPaymentElementChange?: (isComplete: boolean) => void;
};

export default function PaymentFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  form,
  validateItems,
  onToggle,
  onPaymentElementChange,
}: Props) {
  const t = useTranslations("checkout");

  const { watch, unregister, setValue, trigger } = useFormContext();

  const [open, setOpen] = useState(false);

  const billingAddressIsSameAsAddress = watch("billingAddressIsSameAsAddress");
  const paymentMethod = watch("paymentMethod");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (billingAddressIsSameAsAddress) {
      unregister("billingAddress");
      trigger();
    } else {
      setValue("billingAddress", {}, { shouldValidate: true });
      trigger("billingAddress");
    }
  }, [billingAddressIsSameAsAddress, unregister, setValue, trigger]);

  const handlePaymentElementChange = (e: { complete: boolean }) => {
    if (onPaymentElementChange) {
      onPaymentElementChange(e.complete);
    }
  };

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <FieldsGroupContainer
      stage="3/3"
      title={t("payment method")}
      isOpen={isOpen}
      disabled={disabled}
      onToggle={onToggle}
    >
      {/* <RadioGroupField
        view="card"
        loading={loading}
        name="paymentMethod"
        onChange={handlePaymentMethodChange}
        items={paymentMethodsItems as any}
        disabled={disabled}
      /> */}

      <div className="space-y-6 lg:space-y-0">
        <div className="block lg:hidden">
          <FieldsGroupContainer
            signType="plus-minus"
            signPosition="before"
            title={t("redeem promo code")}
            isOpen={open}
            onToggle={handleToggle}
          >
            <PromoCode
              freeShipmentCarrierId={2}
              form={form}
              loading={loading}
              validateItems={validateItems}
            />
          </FieldsGroupContainer>
        </div>
        <div>
          {paymentMethod === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST" && (
            <PaymentElement
              onChange={handlePaymentElementChange}
              options={{
                layout: "tabs",
                fields: {
                  billingDetails: {
                    address: {
                      country: "never",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      <Text variant="uppercase" component="h2">
        {t("billing address")}
      </Text>

      <div className="space-y-2">
        <Text size="small">{t("billing text")}</Text>
        <CheckboxField
          name="billingAddressIsSameAsAddress"
          label={t("same as shipping address")}
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
