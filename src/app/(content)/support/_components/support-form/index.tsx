"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";

import { ReasonInput } from "./reason-input";
import { defaultValues, SupportData, supportSchema } from "./schema";

export function SupportForm() {
  const form = useForm<SupportData>({
    resolver: zodResolver(supportSchema),
    defaultValues,
  });

  const reasonSelected = form.watch("reason");
  const isFormValid = form.formState.isValid;

  const handleCopyForm = () => {
    const values = form.getValues();
    const data = `email: ${values.email}
                    first name: ${values.firstName}
                    last name: ${values.lastName}
                    order ref: ${values.orderRef}
                    tracking ID: ${values.trackingId || "N/A"}
                    reason: ${values.reason}
                    ${
                      values.reason === "OTHER"
                        ? `other reason: ${values.otherReason || "N/A"}`
                        : ""
                    }`;
    navigator.clipboard.writeText(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCopyForm)} className="space-y-6">
        <InputField
          srLabel
          label="email:"
          name="email"
          placeholder="email"
          control={form.control}
        />
        <div className="grid grid-cols-2 gap-2.5">
          <InputField
            srLabel
            label="first name:"
            name="firstName"
            placeholder="first name"
            control={form.control}
          />
          <InputField
            srLabel
            label="last name:"
            name="lastName"
            placeholder="last name"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <InputField
            srLabel
            label="order reference:"
            name="orderRef"
            placeholder="order ref"
            control={form.control}
          />
          <InputField
            srLabel
            label="tracking id"
            name="trackingId"
            placeholder="tracking id"
            control={form.control}
          />
        </div>

        <div className="py-4">
          <ReasonInput reasonSelected={reasonSelected} control={form.control} />
        </div>

        {reasonSelected === "OTHER" && (
          <InputField
            srLabel
            label="other reason:"
            name="otherReason"
            placeholder="enter other reason"
            control={form.control}
          />
        )}

        <Button type="submit" variant="main" size="lg" disabled={!isFormValid}>
          COPY FORM
        </Button>
      </form>
    </Form>
  );
}
