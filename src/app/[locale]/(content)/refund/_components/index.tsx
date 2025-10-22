"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import AftersaleSelector from "../../_components/aftersale-selector";
import { reasons } from "../../_components/constant";
import { defaultData, refundForm, RefundSchema } from "./schema";

export function RefundForm() {
  const t = useTranslations("refund");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<RefundSchema>({
    resolver: zodResolver(refundForm),
    defaultValues: defaultData,
  });

  async function handleSubmit(data: RefundSchema) {
    try {
      const response = await serviceClient.CancelOrderByUser({
        orderUuid: data.orderUuid,
        b64Email: window.btoa(data.email),
        reason: data.reason,
      });

      const errorResponse = response as any;
      if (errorResponse.error) {
        setErrorMessage(t("order already in refund progress"));
        setOpen(true);
        return;
      }

      if (response.order) {
        setErrorMessage(t("refund request submitted successfully"));
        setOpen(true);
        router.push(`/order/${data.orderUuid}/${window.btoa(data.email)}`);
      }

      console.log("Refund request submitted successfully:", data);
    } catch (e) {
      console.error("Form submission failed:", e);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="w-full space-y-9 lg:w-1/2">
            <FieldsGroupContainer
              stage="1/1"
              mode="non-collapsible"
              title={t("check your return status")}
            >
              <InputField
                name="email"
                label={t("email")}
                type="email"
                variant="secondary"
              />
              <InputField
                name="orderUuid"
                label={t("return reference")}
                variant="secondary"
              />
              <div>
                <Text variant="uppercase">{t("reason")}:</Text>
                <AftersaleSelector
                  control={form.control}
                  name="reason"
                  list={reasons}
                  className="w-full lg:w-4/5"
                  renderLabel={(value) => t(value as any)}
                />
              </div>
            </FieldsGroupContainer>
            <Button
              type="submit"
              variant="main"
              size="lg"
              disabled={!form.formState.isValid}
              className="uppercase lg:ml-14"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
      <SubmissionToaster
        open={open}
        onOpenChange={setOpen}
        message={errorMessage}
      />
    </>
  );
}
