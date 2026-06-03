"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessages } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendFormEvent } from "@/lib/analitycs/form";
import { serviceClient } from "@/lib/api";
import { useFixedWithinContainer } from "@/lib/hooks/useFixedWithinContainer";
import { syncSignedInEmailToForm } from "@/lib/stores/account-onboarding/selectors";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { cn } from "@/lib/utils";
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
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const mobileButtonPosition = useFixedWithinContainer({
    containerId: "order-status-page",
    bottomOffset: 24,
  });

  const signedInEmail = useAccountOnboardingStore((s) =>
    s.isSignedIn ? s.account?.email?.trim() || undefined : undefined,
  );
  const form = useForm<OrderStatusData>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      email: signedInEmail ?? "",
      orderUuid: "",
    },
  });

  useEffect(
    () => syncSignedInEmailToForm(form, signedInEmail),
    [form, signedInEmail],
  );

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
        setToastMessage(t("order not found"));
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("order not found");
      setToastMessage(message);
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full space-y-10">
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
              className={cn(
                "absolute inset-x-2.5 bottom-6 z-30 uppercase lg:static",
                {
                  fixed: mobileButtonPosition === "fixed",
                },
              )}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={open}
        onOpenChange={setOpen}
        message={toastMessage}
      />
    </>
  );
}
