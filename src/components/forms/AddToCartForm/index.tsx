"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormContainer } from "@/components/ui/Form/FormContainer";
import { common_ProductSize } from "@/api/proto-http/frontend";
import SelectField from "@/components/ui/Form/fields/SelectField";
import { addToCartSchema, AddToCartData } from "./schema";
import { useState } from "react";

export default function AddToCartForm({
  handleSubmit,
  sizes,
  slug,
}: {
  handleSubmit: (slug: string, size: string) => Promise<void>;
  slug: string;
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
      await handleSubmit(slug, data.size);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <FormContainer
      form={form}
      initialData={{}}
      onSubmit={onSubmit}
      loading={loading}
      className="space-y-8"
      ctaLabel="add to cart"
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
