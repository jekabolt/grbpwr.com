"use client";

import { useState } from "react";
import { errorMessages } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";

const orderStatusSchema = z.object({
  email: z
    .string()
    .max(40, errorMessages.email.max)
    .email(errorMessages.email.invalid)
    .trim(),
  orderUuid: z.string().min(1, "order reference is required").trim(),
});

type OrderStatusData = z.infer<typeof orderStatusSchema>;

export default function OrderStatusForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrderStatusData>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      email: "",
      orderUuid: "",
    },
  });

  async function onSubmit(data: OrderStatusData) {
    setIsLoading(true);
    try {
      await serviceClient.GetOrderByUUIDAndEmail({
        b64Email: window.btoa(data.email),
        orderUuid: data.orderUuid,
      });
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="w-full space-y-10 lg:w-1/2">
          <div className="space-y-6">
            <InputField
              name="email"
              type="email"
              label="EMAIL*"
              variant="secondary"
              loading={isLoading}
            />
            <InputField
              name="orderUuid"
              label="ORDER REFERENCE*"
              variant="secondary"
              loading={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="main"
            size="lg"
            disabled={!form.formState.isValid || isLoading}
            className="uppercase"
          >
            submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
