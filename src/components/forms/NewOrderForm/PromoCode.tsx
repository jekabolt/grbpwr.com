"use client";

import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import InputField from "@/components/ui/Form/fields/InputField";
import { serviceClient } from "@/lib/api";
import { useState } from "react";
import { useFormContext, type Control } from "react-hook-form";

type Props = {
  loading: boolean;
  control: Control<any>;
};

export default function PromoCode({ loading, control }: Props) {
  const [promoLoading, setPromoLoading] = useState(false);
  const { setValue, getValues } = useFormContext();

  const applyPromoCode = async () => {
    setPromoLoading(true);
    const promoCode = getValues("promoCode");

    const response = await serviceClient.ApplyPromoCode({
      orderUuid: "",
      promoCode: promoCode,
    });
    if (response.promo?.allowed) {
      setValue("discount", response.promo.discount?.value ?? 0);
      setValue("isShippingFree", !!response.promo.freeShipping);
    } else {
      setValue("discount", 0);
      setValue("isShippingFree", false);
      // TO-DO show toast - promo not allowed
    }
    setPromoLoading(false);
  };

  return (
    <>
      <InputField
        control={control}
        loading={loading}
        name="promoCode"
        label="discount code or gift card"
      />
      <Button
        style={ButtonStyle.simpleButton}
        onClick={() => {
          applyPromoCode();
        }}
        disabled={promoLoading || loading}
      >
        apply
      </Button>
    </>
  );
}
