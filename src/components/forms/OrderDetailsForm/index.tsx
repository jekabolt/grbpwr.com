"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/ui/Form/fields/InputField";
import { InputMaskedField } from "@/components/ui/Form/fields/InputMaskedField";
import CheckboxField from "@/components/ui/Form/fields/CheckboxField";
import { RadioGroupField } from "@/components/ui/Form/fields/RadioGroupField";

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
      className="space-y-6"
    >
      <h2 className="mb-8 text-lg">contact</h2>
      <InputField
        control={form.control}
        loading={loading}
        name="email"
        label="email address:"
        type="email"
        placeholder="james.bond@example.com"
      />
      <InputField
        control={form.control}
        loading={loading}
        type="number"
        name="phone"
        label="phone number:"
        placeholder="James Bond"
      />
      <div className="space-y-2">
        <CheckboxField
          control={form.control}
          name="subscribe"
          label="email me with news and offers to our newsletter"
        />
        <CheckboxField
          control={form.control}
          name="termsOfService"
          label="i accept the privacy policy and terms & conditions"
        />
      </div>

      <h2 className="mb-8 text-lg">shipping address</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          <InputField
            control={form.control}
            loading={loading}
            name="firstName"
            label="first name:"
            placeholder="James"
          />
        </div>
        <div className="col-span-1">
          <InputField
            control={form.control}
            loading={loading}
            name="lastName"
            label="last name:"
            placeholder="Bond"
          />
        </div>
      </div>
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

      <SelectField
        control={form.control}
        loading={loading}
        name="state"
        label="state:"
        items={[
          { label: "Sweden", value: "sweden" },
          { label: "Norway", value: "norway" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Iceland", value: "iceland" },
          { label: "Ireland", value: "ireland" },
        ]}
      />

      <InputField
        control={form.control}
        loading={loading}
        name="city"
        label="city:"
        placeholder="London"
      />
      <InputField
        control={form.control}
        loading={loading}
        name="address"
        label="streat and houce number:"
        placeholder="sjyrniesu 10"
      />
      <InputField
        control={form.control}
        loading={loading}
        name="additionalAddress"
        label="additional address:"
        placeholder=""
      />
      <InputField
        control={form.control}
        loading={loading}
        name="company"
        label="company:"
        placeholder="Channel"
      />
      <InputField
        control={form.control}
        loading={loading}
        name="postalCode"
        label="postal code:"
        placeholder="37892"
      />

      <h2 className="mb-8 text-lg">shipping method</h2>

      <RadioGroupField
        control={form.control}
        loading={loading}
        name="shippingMethod"
        label="shippingMethod"
        items={[
          {
            label: "dhl standart",
            value: "dhl-standart",
          },
          {
            label: "dhl express",
            value: "dhl-express",
          },
        ]}
      />

      <InputMaskedField
        control={form.control}
        loading={loading}
        name="dateOfBirth"
        mask="dd.mm.yyyy"
        label="date of birth:"
        placeholder="01.01.2000"
      />
    </FormContainer>
  );
}
