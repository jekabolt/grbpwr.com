"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { useActiveSizeInfo } from "../utils/useActiveSizeInfo";

export function MobileSelectSize({
  product,
  activeSizeId,
  open,
  outOfStock,
  onNotifyMeOpen,
  onOpenChange,
  handleSizeSelect,
}: {
  product: common_ProductFull;
  activeSizeId: number | undefined;
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
          grbpwr mobile menu
        </DialogPrimitives.Title>
        <DialogPrimitives.Content className="blackTheme fixed bottom-0 left-0 z-50 flex h-auto w-screen flex-col gap-10 bg-bgColor p-2.5 pb-10 text-textColor">
          <DialogPrimitives.Close asChild>
            <div className="flex items-center justify-between">
              <Text variant="uppercase">select size</Text>
              <Text variant="uppercase">[x]</Text>
            </div>
          </DialogPrimitives.Close>
          <div className="grid grid-cols-4 gap-y-7">
            {sizeNames?.map(({ name, id }) => {
              const isOutOfStock = outOfStock?.[id];
              const isActive = activeSizeId === id;

              if (isOutOfStock) {
                return (
                  <Button
                    key={id}
                    variant={isOutOfStock ? "crossed" : "default"}
                    className={cn("uppercase", {
                      "text-textColor": isActive && isOutOfStock,
                      "border-b border-textColor": isActive && !isOutOfStock,
                    })}
                    onClick={() => handleSizeClick(id)}
                  >
                    {name}
                  </Button>
                );
              }

              return (
                <DialogPrimitives.Close asChild key={id}>
                  <Button
                    className={cn("uppercase", {
                      "border-b border-textColor": isActive,
                    })}
                    onClick={() => handleSizeClick(id)}
                  >
                    {name}
                  </Button>
                </DialogPrimitives.Close>
              );
            })}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
