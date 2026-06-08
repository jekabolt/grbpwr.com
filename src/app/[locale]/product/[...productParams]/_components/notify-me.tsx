"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { sendNotifyMeIntentEvent } from "@/lib/analitycs/product-engagement";
import { serviceClient } from "@/lib/api";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { Button } from "@/components/ui/button";
import CheckboxGlobal from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { SizePicker } from "./size-picker";
import { defaultData, notifySchema, NotifySchema } from "./utils/notify-schema";

interface NotifyMeProps {
  id: number;
  open: boolean;
  sizeNames?: { name: string; id: number }[];
  outOfStock?: Record<number, boolean>;
  activeSizeId?: number;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  productCategory?: string;
}

export function NotifyMe({
  id,
  open,
  onOpenChange,
  sizeNames,
  outOfStock,
  activeSizeId,
  productName = "",
  productCategory = "",
}: NotifyMeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const t = useTranslations("newslatter");
  const tNav = useTranslations("navigation");
  const tProduct = useTranslations("product");
  const tToaster = useTranslations("toaster");
  const tAccessibility = useTranslations("accessibility");
  const signedInEmail = useAccountOnboardingStore((s) =>
    s.isSignedIn ? s.account?.email?.trim() || undefined : undefined,
  );

  const outOfStockSizes =
    sizeNames?.filter((size) => outOfStock?.[size.id]) || [];

  const form = useForm<NotifySchema>({
    resolver: zodResolver(notifySchema),
    defaultValues: {
      ...defaultData,
      sizeId: activeSizeId || 0,
      productId: id,
    },
    mode: "onSubmit",
  });

  const selectedSizeId = form.watch("sizeId");

  useEffect(() => {
    if (open && activeSizeId) {
      form.reset({
        email: signedInEmail ?? "",
        sizeId: activeSizeId,
        productId: id,
      });
      setHasInteracted(false);
      setIsChecked(false);

      const sizeName = sizeNames?.find((s) => s.id === activeSizeId)?.name;
      sendNotifyMeIntentEvent({
        product_id: id.toString(),
        product_name: productName,
        product_category: productCategory,
        size_id: activeSizeId,
        size_name: sizeName,
        action: "opened",
      });
    }
  }, [
    open,
    activeSizeId,
    id,
    sizeNames,
    productName,
    productCategory,
    form,
    signedInEmail,
  ]);

  const handleSizeSelect = (sizeId: number) => {
    form.setValue("sizeId", sizeId);
    setHasInteracted(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && open && !hasInteracted) {
      const sizeName = sizeNames?.find((s) => s.id === selectedSizeId)?.name;
      sendNotifyMeIntentEvent({
        product_id: id.toString(),
        product_name: productName,
        product_category: productCategory,
        size_id: selectedSizeId,
        size_name: sizeName,
        action: "closed_without_submit",
      });
    }
    onOpenChange(isOpen);
  };

  async function handleSubmit(data: NotifySchema) {
    if (isLoading) return; // guard against rapid double-submits
    if (!isChecked) {
      // No consent → don't subscribe, tell the user why.
      setToastMessage(tToaster("required_terms"));
      setToastOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      await serviceClient.NotifyMe({
        email: data.email,
        productId: data.productId,
        sizeId: data.sizeId,
      });

      const sizeName = sizeNames?.find((s) => s.id === data.sizeId)?.name;
      sendNotifyMeIntentEvent({
        product_id: id.toString(),
        product_name: productName,
        product_category: productCategory,
        size_id: data.sizeId,
        size_name: sizeName,
        action: "submitted",
      });

      onOpenChange(false);
      form.reset();
      setToastMessage(tToaster("notify_me_success"));
      setToastOpen(true);
    } catch (e) {
      console.error("Form submission failed:", e);
      const message =
        e instanceof Error && e.message
          ? e.message
          : tToaster("failed_to_subscribe");
      setToastMessage(message);
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogPrimitives.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay data-[state=open]:animate-modal-fade-in data-[state=closed]:animate-modal-fade-out" />
        <DialogPrimitives.Content className="fixed inset-x-2.5 top-1/2 z-50 flex h-auto w-auto -translate-y-1/2 flex-col border border-textInactiveColor bg-bgColor p-2.5 text-textColor data-[state=open]:animate-modal-fade-in data-[state=closed]:animate-modal-fade-out lg:inset-x-auto lg:left-1/2 lg:w-80 lg:-translate-x-1/2">
              <DialogPrimitives.Title className="sr-only">
                {tAccessibility("notify me dialog")}
              </DialogPrimitives.Title>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex h-auto flex-col justify-between gap-10"
                >
                  <div className="flex items-center justify-between">
                    <Text variant="uppercase">{tProduct("notify me")}</Text>
                    <DialogPrimitives.Close asChild>
                      <Button aria-label={tNav("close")}>[x]</Button>
                    </DialogPrimitives.Close>
                  </div>
                  <div className="flex h-full flex-col justify-center space-y-10">
                    <Text className="leading-none">
                      {tProduct("notify-description")}
                    </Text>

                    <div className="space-y-16 lg:space-y-10">
                      <div className="space-y-4">
                        <Text>{tProduct("select size")}:</Text>
                        <SizePicker
                          sizeNames={outOfStockSizes}
                          activeSizeId={selectedSizeId}
                          handleSizeSelect={handleSizeSelect}
                          view="grid"
                        />
                        {form.formState.errors.sizeId && (
                          <Text className="text-errorColor">
                            {form.formState.errors.sizeId.message}
                          </Text>
                        )}
                      </div>
                      <div className="space-y-4" data-nosnippet>
                        <InputField
                          name="email"
                          label={t("email")}
                          type="email"
                          variant="secondary"
                        />
                        <CheckboxGlobal
                          name="newsLetter"
                          label={tProduct.rich("notify-agree", {
                            privacy: (chunks) => (
                              <Link
                                href="/legal-notices?section=privacy"
                                className="underline hover:no-underline"
                              >
                                {chunks}
                              </Link>
                            ),
                          })}
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) =>
                            setIsChecked(checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="main"
                    type="submit"
                    size="lg"
                    className="w-full uppercase transition-opacity active:opacity-70"
                    disabled={form.formState.isSubmitting || isLoading}
                    loading={isLoading}
                  >
                    {tProduct("notify me")}
                  </Button>
                </form>
              </Form>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </DialogPrimitives.Root>
  );
}
