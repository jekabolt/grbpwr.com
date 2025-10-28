"use client";

import { useEffect } from "react";
import { paymentMethodNamesMap } from "@/constants";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useDataContext } from "@/components/contexts/DataContext";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import RadioGroupField from "@/components/ui/form/fields/radio-group-field";
import { Tron } from "@/components/ui/icons/tron";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import { AddressFields } from "./shipping-fields-group";

export const paymentMethodIcons: Record<string, React.ReactNode> = {
  PAYMENT_METHOD_NAME_ENUM_USDT_TRON: <Tron />,
};

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
  const { watch, unregister } = useFormContext();
  const t = useTranslations("checkout");
  const { handlePaymentMethodChange } = useCheckoutAnalytics({});

  const billingAddressIsSameAsAddress = watch("billingAddressIsSameAsAddress");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (billingAddressIsSameAsAddress) {
      unregister("billingAddress");
    }
  }, [billingAddressIsSameAsAddress, unregister]);

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
    icon: v.name ? paymentMethodIcons[v.name] || null : null,
  }));

  return (
    <FieldsGroupContainer
      stage="3/3"
      title={t("payment method")}
      isOpen={isOpen}
      disabled={disabled}
      onToggle={onToggle}
      summary={selectedPaymentMethod && <Text>{selectedPaymentMethod}</Text>}
    >
      <RadioGroupField
        view="card"
        loading={loading}
        name="paymentMethod"
        onChange={handlePaymentMethodChange}
        items={paymentMethodsItems as any}
        disabled={disabled}
      />
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
