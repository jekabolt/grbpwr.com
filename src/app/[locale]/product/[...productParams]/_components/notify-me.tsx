"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { serviceClient } from "@/lib/api";
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
}

export function NotifyMe({
  id,
  open,
  onOpenChange,
  sizeNames,
  outOfStock,
  activeSizeId,
}: NotifyMeProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const t = useTranslations("newslatter");
  const tProduct = useTranslations("product");
  const tToaster = useTranslations("toaster");
  const tAccessibility = useTranslations("accessibility");

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
        email: "",
        sizeId: activeSizeId,
        productId: id,
      });
    }
  }, [open, activeSizeId, id, form]);

  const handleSizeSelect = (sizeId: number) => {
    form.setValue("sizeId", sizeId);
  };

  async function handleSubmit(data: NotifySchema) {
    try {
      await serviceClient.NotifyMe({
        email: data.email,
        productId: data.productId,
        sizeId: data.sizeId,
      });
      onOpenChange(false);
      form.reset();
    } catch (e) {
      console.error("Form submission failed:", e);
      const message =
        e instanceof Error && e.message
          ? e.message
          : tToaster("failed_to_subscribe");
      setToastMessage(message);
      setToastOpen(true);
    }
  }

  return (
    <DialogPrimitives.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2.5 top-1/2 z-50 flex h-auto w-auto -translate-y-1/2 flex-col border border-textInactiveColor bg-bgColor p-2.5 text-textColor lg:inset-x-auto lg:left-1/2 lg:w-80 lg:-translate-x-1/2">
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
                  <Button>[x]</Button>
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
                      label={t("agree")}
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
                className="w-full uppercase"
                disabled={form.formState.isSubmitting}
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
