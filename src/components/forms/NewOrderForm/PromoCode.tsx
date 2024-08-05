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
    console.log("apply");
    setPromoLoading(true);
    const promoCode = getValues("promoCode");

    try {
      const response = await serviceClient.ApplyPromoCode({
        orderUuid: undefined,
        promoCode: promoCode,
      });
      // TO-DO use refactored endpoint
      //   setValue('discount', response.discount);
      console.log(response);
      setValue("discount", 10);
      setPromoLoading(false);
    } catch (error) {
      console.error("Error applying promo:", error);
      setPromoLoading(false);
    }
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
