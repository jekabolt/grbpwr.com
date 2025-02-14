"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import { CopyIcon } from "@/components/ui/icons/copy-icon";

import { defaultValues, SupportData, supportSchema } from "./schema";

export function SupportForm() {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCopyForm)} className="space-y-8">
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
        <Button
          variant="underline"
          className="flex items-center gap-3 uppercase"
        >
          copy form <CopyIcon />
        </Button>
      </form>
    </Form>
  );
}
