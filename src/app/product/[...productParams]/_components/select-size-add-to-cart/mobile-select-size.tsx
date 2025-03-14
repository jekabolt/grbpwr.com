"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { useData } from "./useData";

export function MobileSelectSize({
  product,
  activeSizeId,
  triggerRef,
  handleSizeSelect,
}: {
  product: common_ProductFull;
  activeSizeId: number | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  handleSizeSelect: (sizeId: number) => void;
}) {
  const { triggerText, sizeNames } = useData({ product, activeSizeId });

  return (
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button
          ref={triggerRef}
          className="border-textInaciveColor w-full border-b pb-1 text-left uppercase"
        >
          {triggerText}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <Overlay cover="screen" />
        <DialogPrimitives.Title className="sr-only">
          grbpwr mobile menu
        </DialogPrimitives.Title>
        <DialogPrimitives.Content className="fixed bottom-0 left-0 z-40 flex h-auto w-screen flex-col gap-10 bg-bgColor p-2.5 pb-10">
          <DialogPrimitives.Close asChild>
            <div className="flex items-center justify-between">
              <Text variant="uppercase">select size</Text>
              <Text variant="uppercase">[x]</Text>
            </div>
          </DialogPrimitives.Close>
          <div className="grid grid-cols-4 gap-y-7">
            {sizeNames?.map(({ name, id }) => (
              <DialogPrimitives.Close asChild key={id}>
                <Button
                  key={id}
                  className={cn("", {
                    "border-b border-black": activeSizeId === id,
                  })}
                  onClick={() => handleSizeSelect(id)}
                >
                  {name}
                </Button>
              </DialogPrimitives.Close>
            ))}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
