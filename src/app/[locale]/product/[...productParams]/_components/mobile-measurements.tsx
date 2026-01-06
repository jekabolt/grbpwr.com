import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/ui/text";
import { sendButtonEvent } from "@/lib/analitycs/button";

import { Button } from "../../../../../components/ui/button";
import { Measurements } from "./measurements";
import { useProductBasics } from "./utils/useProductBasics";

export function MobileMeasurements({
  product,
  selectedSize,
  outOfStock,
  isOneSize,
  handleSelectSize,
}: MobileMeasurementsProps) {
  const [open, setOpen] = useState(false);
  const { name } = useProductBasics({ product });
  const t = useTranslations("product");
  const tAccessibility = useTranslations("accessibility");

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      sendButtonEvent({
        buttonId: "size_guide",
        productName: name,
      });
    }
    setOpen(isOpen);
  };

  return (
    /**
     * Non-modal so the fixed main AddToCart button remains clickable even when this dialog is open.
     * We also keep a bottom gap (bottom-20) so the dialog/overlay never covers the CTA area.
     */
    <DialogPrimitives.Root open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          {t("size guide")}
        </Button>
      </DialogPrimitives.Trigger>

      <DialogPrimitives.Portal>
        {/* Overlay covers the header (high z), but stops above the fixed CTA area */}
        <DialogPrimitives.Overlay className="fixed inset-x-0 top-0 bottom-20 z-[60] h-screen bg-overlay" />

        {/* Content is above overlay, also stops above the fixed CTA area */}
        <DialogPrimitives.Content className="fixed inset-x-2 top-2 bottom-20 z-[70] flex flex-col gap-4 overflow-hidden border border-textInactiveColor bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>

          <div className="flex h-full min-h-0 flex-col">
            {/* Dialog header stays fixed; only table scrolls */}
            <div className="relative flex shrink-0 items-center justify-between">
              <Text variant="uppercase">{t("size guide")}</Text>
              <DialogPrimitives.Close asChild>
                <Button>[x]</Button>
              </DialogPrimitives.Close>
            </div>

            {/* Only the measurements section scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Measurements
                product={product}
                selectedSize={selectedSize}
                outOfStock={outOfStock}
                isOneSize={isOneSize}
                handleSelectSize={handleSelectSize}
              />
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

export type MobileMeasurementsProps = {
  product: common_ProductFull;
  selectedSize: number;
  outOfStock?: Record<number, boolean>;
  isOneSize?: boolean;
  handleSelectSize: (size: number) => void;
};
