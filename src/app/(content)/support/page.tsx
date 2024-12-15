"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/form/fields/input-field";
import { FormContainer } from "@/components/ui/form/form-container";
import { CopyIcon } from "@/components/ui/icons/copy-icon";
import { Text } from "@/components/ui/text";

import { defaultValues, SupportData, supportSchema } from "./schema";

export default function SupportPage() {
  const form = useForm<SupportData>({
    resolver: zodResolver(supportSchema),
    defaultValues,
  });

  const handleCopyForm = () => {
    const values = form.getValues();
    const data = `full name: ${values.name}\norder #: ${values.orderNumber}\ntracking #: ${values.trackingNumber}\nrequest: ${values.request}`;
    navigator.clipboard.writeText(data);
  };

  return (
    <div className="mx-auto mt-16 w-full space-y-16 sm:w-2/5">
      <FormContainer
        form={form}
        submitButton={
          <Button
            variant="underline"
            className="flex items-center gap-3 uppercase"
          >
            copy form <CopyIcon />
          </Button>
        }
        onSubmit={handleCopyForm}
        className="space-y-8"
      >
        <Text variant="uppercase">1/2 fill out the form</Text>
        <InputField
          label="full name:"
          name="name"
          placeholder="enter your name"
          control={form.control}
        />
        <InputField
          label="order #:"
          name="orderNumber"
          placeholder="enter your order number"
          control={form.control}
        />
        <InputField
          label="tracking #:"
          name="trackingNumber"
          placeholder="enter your tracking number"
          control={form.control}
        />
        <InputField
          label="your request:"
          name="request"
          placeholder="enter your request"
          control={form.control}
        />
      </FormContainer>
      <div className="space-y-8">
        <Text variant="uppercase">2/2 send us your completed form via</Text>
        <div className="flex gap-4 ">
          <Button variant="underlineWithColors">telegram bot</Button>
          <Button variant="underlineWithColors">email</Button>
        </div>
      </div>
    </div>
  );
}
