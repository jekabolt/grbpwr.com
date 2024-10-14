"use client";

import { common_ProductSize } from "@/api/proto-http/frontend";
import SelectField from "@/components/ui/Form/fields/SelectField";
import { FormContainer } from "@/components/ui/Form/FormContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AddToCartData, addToCartSchema } from "./schema";

// todo: rework this to share logic with measurement modal
export default function AddToCartForm({
  handleSubmit,
  sizes,
  id,
}: {
  handleSubmit: ({ id, size }: { id: number; size: string }) => Promise<void>;
  id: number;
  sizes: common_ProductSize[];
}) {
  const [loading, setLoadingStatus] = useState(false);
  const form = useForm<AddToCartData>({
    resolver: zodResolver(addToCartSchema),
  });

  const onSubmit = async (data: AddToCartData) => {
    if (loading) return;

    setLoadingStatus(true);
    try {
      await handleSubmit({ id, size: data.size });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <FormContainer
      form={form}
      onSubmit={onSubmit}
      className="space-y-8"
      // <AddToCartFo
      submitButton={"add to cart" as any}
      footerSide="right"
    >
      <SelectField
        control={form.control}
        loading={loading}
        name="size"
        label="size"
        placeholder="choose size"
        items={sizes.map((size) => ({
          label: size.sizeId + "",
          value: size.sizeId + "",
        }))}
      />
    </FormContainer>
  );
}
