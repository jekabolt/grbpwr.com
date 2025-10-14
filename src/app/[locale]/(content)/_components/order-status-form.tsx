"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessages } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendFormEvent } from "@/lib/analitycs/form";
import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import { SubmissionToaster } from "@/components/ui/toaster";

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
  const t = useTranslations("order-status");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
      const response = await serviceClient.GetOrderByUUIDAndEmail({
        orderUuid: data.orderUuid,
        b64Email: window.btoa(data.email),
      });

      sendFormEvent({
        email: data.email,
        formId: "order_status",
      });

      if (response.order) {
        router.push(`/order/${data.orderUuid}/${window.btoa(data.email)}`);
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full space-y-10 lg:w-1/2">
            <div className="space-y-6">
              <InputField
                name="email"
                type="email"
                label={t("email")}
                variant="secondary"
                loading={isLoading}
              />
              <InputField
                name="orderUuid"
                label={t("order reference")}
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
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={open}
        onOpenChange={setOpen}
        message={t("order not found")}
      />
    </>
  );
}
