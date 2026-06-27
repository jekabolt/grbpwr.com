"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { common_OrderFull } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { sendRefundEvent } from "@/lib/analitycs/checkout";
import { sendFormEvent } from "@/lib/analitycs/form";
import { SizeMap } from "@/lib/analitycs/utils";
import { serviceClient } from "@/lib/api";
import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { getErrorMessage } from "@/lib/error-message";
import { useFixedWithinContainer } from "@/lib/hooks/useFixedWithinContainer";
import { syncSignedInEmailToForm } from "@/lib/stores/account-onboarding/selectors";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
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
  const { dictionary } = useDataContext();
  const t = useTranslations("refund");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const signedInEmail = useAccountOnboardingStore((s) =>
    s.isSignedIn ? s.account?.email?.trim() || undefined : undefined,
  );
  const form = useForm<RefundSchema>({
    resolver: zodResolver(refundForm),
    defaultValues: { ...defaultData, email: signedInEmail ?? "" },
  });

  useEffect(
    () => syncSignedInEmailToForm(form, signedInEmail),
    [form, signedInEmail],
  );

  const mobileButtonPosition = useFixedWithinContainer({
    containerId: "refund-page",
    bottomOffset: 24,
  });

  function handleRefundEvent(order: common_OrderFull, reason: string) {
    const categories = dictionary?.categories || [];
    const items = order.orderItems || [];

    const topCategoryId =
      items.find((i) => i.topCategoryId)?.topCategoryId || 0;
    const subCategoryId =
      items.find((i) => i.subCategoryId)?.subCategoryId || 0;

    const topCategoryName = getTopCategoryName(categories, topCategoryId) || "";
    const subCategoryName = getSubCategoryName(categories, subCategoryId) || "";

    const sizeMap: SizeMap = (dictionary?.sizes || []).reduce<SizeMap>(
      (acc, s) => {
        if (s.id != null && s.name) acc[s.id] = s.name.trim();
        return acc;
      },
      {},
    );

    sendRefundEvent(
      order,
      topCategoryName,
      subCategoryName,
      undefined,
      sizeMap,
      reason,
    );
  }

  async function handleSubmit(data: RefundSchema) {
    try {
      const response = await serviceClient.CancelOrderByUser({
        orderUuid: data.orderUuid,
        b64Email: window.btoa(data.email),
        reason: data.reason,
      });

      const errorResponse = response as { error?: string };
      if (errorResponse.error) {
        setToastMessage(errorResponse.error);
        setOpen(true);
        return;
      }

      if (response.order) {
        handleRefundEvent(response.order, data.reason);
        sendFormEvent({
          email: data.email,
          formId: "refund",
        });
        setToastMessage(
          t("return_request_success", { orderNumber: data.orderUuid }),
        );
        form.reset(defaultData);
        setOpen(true);
        setTimeout(() => {
          router.push(
            `/order/${data.orderUuid}/${encodeURIComponent(window.btoa(data.email))}`,
          );
        }, 2500);
      }
    } catch (e) {
      console.error("Form submission failed:", e);
      const message = getErrorMessage(e, t("submission_error"));
      setToastMessage(message);
      setOpen(true);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-9 w-full space-y-9 lg:mb-0">
            <FieldsGroupContainer
              stage="1/1"
              collapsible={false}
              title={t("submit return")}
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
                  className="w-full"
                  renderLabel={(value) => t(value as any)}
                />
              </div>
            </FieldsGroupContainer>
            <Button
              type="submit"
              variant="main"
              size="lg"
              disabled={form.formState.isSubmitting}
              className={cn(
                "absolute inset-x-2.5 bottom-6 z-30 uppercase lg:static lg:ml-14",
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
