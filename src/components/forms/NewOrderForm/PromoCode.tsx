"use client";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/form/fields/InputField";
import { useState } from "react";
import { useFormContext, type Control } from "react-hook-form";

type Props = {
  loading: boolean;
  control: Control<any>;
  validateItemsAndUpdateCookie: () => Promise<ValidateOrderItemsInsertResponse | null>;
  freeShipmentCarrierId?: number;
};

export default function PromoCode({
  loading,
  control,
  validateItemsAndUpdateCookie,
  freeShipmentCarrierId,
}: Props) {
  const [promoLoading, setPromoLoading] = useState(false);
  const { setValue } = useFormContext();

  async function handleApplyPromoClick() {
    setPromoLoading(true);

    const response = await validateItemsAndUpdateCookie();

    if (response?.promo?.freeShipping) {
      setValue("shipmentCarrierId", freeShipmentCarrierId + "");
    }

    setPromoLoading(false);
  }

  return (
    <>
      <InputField
        control={control}
        loading={loading}
        name="promoCode"
        label="discount code or gift card"
      />
      <Button
        variant="main"
        onClick={handleApplyPromoClick}
        disabled={promoLoading || loading}
      >
        apply
      </Button>
    </>
  );
}
