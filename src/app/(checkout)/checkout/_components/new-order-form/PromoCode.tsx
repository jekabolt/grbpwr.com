"use client";

import { useState } from "react";
import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useFormContext, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/form/fields/input-field";

type Props = {
  loading: boolean;
  form: UseFormReturn<any>;
  validateItems: () => Promise<ValidateOrderItemsInsertResponse | null>;
  freeShipmentCarrierId?: number;
};

export default function PromoCode({
  loading,
  form,
  validateItems,
  freeShipmentCarrierId,
}: Props) {
  const [isApplied, setIsApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const { setValue } = useFormContext();

  const promoCode = form.watch("promoCode");

  async function handleApplyPromoClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!promoCode) return;
    setPromoLoading(true);

    try {
      const response = await validateItems();

      if (response?.promo?.freeShipping) {
        setValue("shipmentCarrierId", freeShipmentCarrierId + "");
      }

      setIsApplied(true);
    } catch (error) {
      console.error(error);
    } finally {
      setPromoLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-between border border-textInactiveColor px-4 py-1.5">
      <InputField
        control={form.control}
        loading={loading}
        placeholder="ENTER PROMO CODE"
        name="promoCode"
        autocomplete="off"
        className="w-full grow border-none text-textBaseSize leading-4"
      />
      <Button
        type="input"
        className="flex-none"
        onClick={handleApplyPromoClick}
        disabled={isApplied || promoLoading || loading || !promoCode}
      >
        {isApplied ? "APPLIED" : "APPLY"}
      </Button>
    </div>
  );
}
