"use client";

import { useState } from "react";
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
  const t = useTranslations("newslatter");

  const outOfStockSizes =
    sizeNames?.filter((size) => outOfStock?.[size.id]) || [];

  const form = useForm<NotifySchema>({
    resolver: zodResolver(notifySchema),
    defaultValues: {
      ...defaultData,
      sizeId: activeSizeId || 0,
      productId: id,
    },
  });

  const selectedSizeId = form.watch("sizeId");
  const selectedSizeName = outOfStockSizes.find(
    (size) => size.id === selectedSizeId,
  )?.name;

  const handleSizeSelect = (sizeId: number) => {
    form.setValue("sizeId", sizeId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  async function handleSubmit(data: NotifySchema) {
    try {
      await serviceClient.NotifyMe({
        email: data.email,
        productId: data.productId,
        sizeId: data.sizeId,
      });
      console.log("NotifyMe request submitted successfully:", data);
      onOpenChange(false);
      form.reset();
    } catch (e) {
      console.error("Form submission failed:", e);
    }
  }

  return (
    <DialogPrimitives.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen bg-overlay" />
        <DialogPrimitives.Content className="border-inactive fixed inset-0 z-50 h-screen w-screen border bg-bgColor p-2.5 lg:left-1/2 lg:top-1/2 lg:h-[45%] lg:w-80 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <DialogPrimitives.Title className="sr-only">
            grbpwr notify me
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <Text variant="uppercase">notify me</Text>
              <DialogPrimitives.Close asChild>
                <Button>[x]</Button>
              </DialogPrimitives.Close>
            </div>

            <Text>
              select your size and we will email you when this product is back
              in stock.
            </Text>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex h-full flex-col justify-between"
              >
                <div className="space-y-10">
                  <div className="space-y-4">
                    <Text>select size:</Text>
                    <SizePicker
                      sizeNames={outOfStockSizes}
                      activeSizeId={selectedSizeId}
                      handleSizeSelect={handleSizeSelect}
                      view="grid"
                    />
                    {form.formState.errors.sizeId && (
                      <Text className="text-[10px] text-errorColor">
                        {form.formState.errors.sizeId.message}
                      </Text>
                    )}
                  </div>
                  <InputField
                    name="email"
                    label="email"
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
                <Button
                  variant="main"
                  type="submit"
                  size="lg"
                  className="w-full uppercase"
                  disabled={
                    !isChecked ||
                    !selectedSizeId ||
                    !form.formState.isValid ||
                    form.formState.isSubmitting
                  }
                >
                  notify me
                </Button>
              </form>
            </Form>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
