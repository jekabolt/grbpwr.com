"use client";

import { useEffect, useRef, useState } from "react";
import { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { PaymentElement } from "@stripe/react-stripe-js";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useFormContext, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import PromoCode from "./PromoCode";
import { AddressFields } from "./shipping-fields-group";
import {
  isStripeCardPaymentMethod,
  normalizeStripeCardPaymentMethod,
} from "./utils";

type Props = {
  loading: boolean;
  isOpen: boolean;
  disabled?: boolean;
  form: UseFormReturn<any>;
  showPaymentError?: boolean;
  validateItems: () => Promise<ValidateOrderItemsInsertResponse | null>;
  onPromoError?: (message: string) => void;
  onToggle: () => void;
  onPaymentElementChange?: (isComplete: boolean) => void;
};

export default function PaymentFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  form,
  showPaymentError = false,
  validateItems,
  onPromoError,
  onToggle,
  onPaymentElementChange,
}: Props) {
  const t = useTranslations("checkout");

  const { watch, unregister, setValue, trigger } = useFormContext();

  const [open, setOpen] = useState(false);

  const billingAddressIsSameAsAddress = watch("billingAddressIsSameAsAddress");
  const paymentMethod = watch("paymentMethod");
  const shippingCountry = watch("country");
  const showStripePaymentElement = isStripeCardPaymentMethod(paymentMethod);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const normalizedPaymentMethod =
      normalizeStripeCardPaymentMethod(paymentMethod);
    if (normalizedPaymentMethod && normalizedPaymentMethod !== paymentMethod) {
      setValue("paymentMethod", normalizedPaymentMethod, {
        shouldValidate: false,
      });
    }
  }, [paymentMethod, setValue]);

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
      <div className="space-y-6 lg:space-y-0">
        <div className="block lg:hidden">
          <FieldsGroupContainer
            signType="plus-minus"
            signPosition="before"
            title={t("redeem promo code")}
            isOpen={open}
            disabled={disabled || loading}
            onToggle={handleToggle}
          >
            <PromoCode
              freeShipmentCarrierId={2}
              form={form}
              loading={loading}
              validateItems={validateItems}
              onError={onPromoError}
            />
          </FieldsGroupContainer>
        </div>
        <div
          className={
            disabled || loading ? "pointer-events-none opacity-50" : ""
          }
        >
          {showStripePaymentElement && (
            <>
              <PaymentElement
                onChange={handlePaymentElementChange}
                options={{
                  layout: "tabs",
                  // Show Apple Pay / Google Pay, hide Stripe Link (we don't want
                  // its inline email/save form). `link` is honored by stripe.js
                  // at runtime but was dropped from PaymentWalletsOption in the
                  // installed types, so the wallets object is widened locally.
                  wallets: {
                    applePay: "auto",
                    googlePay: "auto",
                    link: "never",
                  } as StripePaymentElementOptions["wallets"] & {
                    link: "never";
                  },
                  fields: {
                    billingDetails: {
                      address: {
                        country: "never",
                      },
                    },
                  },
                  defaultValues: {
                    billingDetails: {
                      address: {
                        country: shippingCountry || undefined,
                      },
                    },
                  },
                }}
              />
              {showPaymentError && (
                <Text className="mt-2 text-xs text-errorColor">
                  {t("card_details_required")}
                </Text>
              )}
            </>
          )}
        </div>
      </div>

      <Text
        variant="uppercase"
        component="h2"
        className={cn("", {
          "text-textInactiveColor": disabled || loading,
        })}
      >
        {t("billing address")}
      </Text>

      <div className="space-y-2">
        <Text
          className={cn("", {
            "text-textInactiveColor": disabled || loading,
          })}
        >
          {t("billing text")}
        </Text>

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
