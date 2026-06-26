"use client";

import { useState } from "react";
import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useFormContext, UseFormReturn } from "react-hook-form";

import {
  sendCouponAppliedEvent,
  sendCouponRemovedEvent,
} from "@/lib/analitycs/promo";
import { getErrorMessage } from "@/lib/error-message";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/form/fields/input-field";

type Props = {
  loading: boolean;
  form: UseFormReturn<any>;
  freeShipmentCarrierId?: number;
  validateItems: () => Promise<ValidateOrderItemsInsertResponse | null>;
  currency?: string;
  onError?: (message: string) => void;
};

export default function PromoCode({
  loading,
  form,
  validateItems,
  freeShipmentCarrierId,
  currency = "EUR",
  onError,
}: Props) {
  const [isApplied, setIsApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { setValue } = useFormContext();
  const promoCode = form.watch("promoCode");
  const t = useTranslations("checkout");
  const tToaster = useTranslations("toaster");

  const handleFocus = () => {
    setIsFocused(true);
  };

  async function handleApplyPromoClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!promoCode) return;
    setPromoLoading(true);

    if (isApplied) {
      sendCouponRemovedEvent(promoCode, currency);
      setIsApplied(false);
      setValue("promoCode", "");
      setPromoLoading(false);
      return;
    }

    try {
      const response = await validateItems();

      if (response?.promo?.freeShipping) {
        setValue("shipmentCarrierId", freeShipmentCarrierId + "");
      }

      if (response?.promo) {
        const discountAmount = parseFloat(response.promo.discount?.value || "0");
        sendCouponAppliedEvent(promoCode, discountAmount, currency);
      }

      setIsApplied(true);
    } catch (error) {
      console.error(error);
      onError?.(getErrorMessage(error, tToaster("validation_error")));
    } finally {
      setPromoLoading(false);
    }
  }

  return (
    <div className="relative flex items-center border border-textInactiveColor px-4 py-1.5">
      <div className="flex-1">
        <InputField
          control={form.control}
          loading={loading}
          label={t("enter promo code")}
          srLabel
          placeholder={t("enter promo code")}
          name="promoCode"
          readOnly={!isFocused || isApplied}
          onFocus={handleFocus}
          autoComplete="off"
          className="w-full grow border-none text-textBaseSize leading-4"
        />
      </div>
      <Button
        type="button"
        className="flex-none uppercase"
        loading={promoLoading}
        onClick={handleApplyPromoClick}
        disabled={promoLoading || loading || !promoCode}
      >
        {isApplied ? t("discard") : t("apply")}
      </Button>
    </div>
  );
}
