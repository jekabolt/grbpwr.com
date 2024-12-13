"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CopyFormContainer } from "@/components/ui/copy-form/copy-form-container";
import InputField from "@/components/ui/form/fields/input-field";
import { CopyIcon } from "@/components/ui/icons/copy-icon";
import { Text } from "@/components/ui/text";

import { defaultValues, SupportData, supportSchema } from "./schema";

export default function SupportPage() {
  const form = useForm<SupportData>({
    resolver: zodResolver(supportSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleCopyForm = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    const data = `full name: ${values.name}\norder #: ${values.orderNumber}\ntracking #: ${values.trackingNumber}\nrequest: ${values.request}`;
    navigator.clipboard.writeText(data);
  };

  return (
    <div className="mx-auto w-full border-0 border-dashed border-gray-200 sm:w-1/2 sm:border-2 sm:px-20 sm:pb-20 sm:pt-[60px]">
      <Text variant="uppercase" className="mb-10 sm:text-center">
        <span className="sm:hidden">1/2</span> fill out the form
      </Text>
      <CopyFormContainer
        form={form}
        copyButton="Copy Text"
        onCopy={handleCopyForm}
        className="space-y-8"
      >
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
      </CopyFormContainer>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-8">
        <Text variant="uppercase" className="sm:text-center">
          <span className="hidden sm:block">
            send us your completed form via
          </span>
          <span className="block sm:hidden">2/2 contact us</span>
        </Text>
        <div className="flex gap-4 sm:grid sm:justify-items-center sm:gap-8">
          <Button
            variant="underline"
            className="items-center gap-2 uppercase sm:flex"
          >
            email
            <CopyIcon className="hidden h-4 w-4 sm:block" />
          </Button>
          <Button variant="underline" className="uppercase">
            telegram
          </Button>
        </div>
      </div>
    </div>
  );
}
