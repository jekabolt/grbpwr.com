"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/Form";
import { InputField } from "@/components/ui/Form/fields/InputField";
import { InputMaskedField } from "@/components/ui/Form/fields/InputMaskedField";
import { CheckboxField } from "@/components/ui/Form/fields/CheckboxField";

import { SubmitButton } from "../SubmitButton";
import { orderDetailsSchema, defaultData, OrderDetailsData } from "./schema";
import { SelectField } from "@/components/ui/Form/fields/SelectField";
import { FormContainer } from "@/components/ui/Form/FormContainer";

export default function ConfirmOrderForm({
  initialData,
}: {
  initialData?: OrderDetailsData;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<OrderDetailsData>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: initialData || defaultData,
  });

  const onSubmit = async (data: OrderDetailsData) => {
    // "use server";
    console.log("data:");
    console.log(data);
    // try {
    //   setLoading(true);
    //   const path = `${spaceId}/${resource}`;
    //   const apiBaseUrl = `${apiRoutes.spaces}/${path}`;
    //   const resourceUrl = `${routes.dashboard}/${path}`;

    //   if (initialData) {
    //     await axios.patch(`${apiBaseUrl}/${itemId}`, data);
    //   } else {
    //     await axios.post(apiBaseUrl, data);
    //   }

    //   router.refresh();
    //   router.push(resourceUrl);
    //   toast({ title: `Resource ${initialData ? "updated" : "created"}.` });
    // } catch (error) {
    //   toastError(error, "An error occurred while creating the resource.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <FormContainer
      form={form}
      initialData={initialData}
      onSubmit={onSubmit}
      loading={loading}
    >
      <InputField
        control={form.control}
        loading={loading}
        name="name"
        label="name:"
        placeholder="James Bond"
      />
      <InputField
        control={form.control}
        loading={loading}
        name="email"
        label="email:"
        type="email"
        placeholder="james.bond@example.com"
      />
      <InputMaskedField
        control={form.control}
        loading={loading}
        name="dateOfBirth"
        mask="dd.mm.yyyy"
        label="date of birth:"
        placeholder="01.01.2000"
      />
      <CheckboxField
        control={form.control}
        name="termsOfService"
        label="agree to the terms of service"
      />
      <CheckboxField
        control={form.control}
        name="subscribe"
        label="subscribe to our newsletter"
      />
      <SelectField
        control={form.control}
        loading={loading}
        name="country"
        label="country/region:"
        items={[
          { label: "Sweden", value: "sweden" },
          { label: "Norway", value: "norway" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Iceland", value: "iceland" },
          { label: "Ireland", value: "ireland" },
        ]}
      />
    </FormContainer>
  );
}
