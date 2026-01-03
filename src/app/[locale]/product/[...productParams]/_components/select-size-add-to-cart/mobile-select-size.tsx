"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { useActiveSizeInfo } from "../utils/useActiveSizeInfo";

export function MobileSelectSize({
  product,
  activeSizeId,
  sizeQuantity,
  open,
  outOfStock,
  onNotifyMeOpen,
  onOpenChange,
  handleSizeSelect,
}: {
  product: common_ProductFull;
  activeSizeId: number | undefined;
  sizeQuantity: Record<number, number>;
  open: boolean;
  outOfStock?: Record<number, boolean>;
  handleSizeSelect: (sizeId: number) => void;
  onOpenChange: (open: boolean) => void;
  onNotifyMeOpen?: (sizeId: number) => void;
}) {
  const { sizeNames } = useActiveSizeInfo({
    product,
    activeSizeId,
  });
  const tAccessibility = useTranslations("accessibility");

  const handleSizeClick = (sizeId: number) => {
    const isOutOfStock = outOfStock?.[sizeId];

    if (isOutOfStock) {
      onOpenChange(false);
      setTimeout(() => {
        onNotifyMeOpen?.(sizeId);
      }, 100);
    } else {
      handleSizeSelect(sizeId);
    }
  };

  return (
    <DialogPrimitives.Root
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogPrimitives.Portal>
        <Overlay cover="screen" disablePointerEvents={false} />
        <DialogPrimitives.Title className="sr-only">
          {tAccessibility("mobile menu")}
        </DialogPrimitives.Title>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2 bottom-2 top-auto z-50 flex flex-col gap-10 border border-textInactiveColor bg-bgColor p-2.5 pb-10 text-textColor">
          <DialogPrimitives.Close asChild>
            <div className="flex items-center justify-between">
              <Text variant="uppercase">select size</Text>
              <Text variant="uppercase">[x]</Text>
            </div>
          </DialogPrimitives.Close>
          <div className="grid grid-cols-4 gap-x-2 gap-y-7">
            {sizeNames?.map(({ name, id }) => {
              const isOutOfStock = outOfStock?.[id] || sizeQuantity?.[id] === 0;

              return (
                <Button
                  disabled={!!isOutOfStock}
                  variant={isOutOfStock ? "strikeThrough" : "default"}
                  className="uppercase"
                  key={id}
                  onClick={() => handleSizeClick(id)}
                >
                  {name}
                </Button>
              );
            })}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
