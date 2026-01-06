import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/ui/text";
import { sendButtonEvent } from "@/lib/analitycs/button";

import { Button } from "../../../../../components/ui/button";
import { Measurements } from "./measurements";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { useProductBasics } from "./utils/useProductBasics";

export function MobileMeasurements({
  product,
  selectedSize,
  outOfStock,
  isOneSize,
  handleSelectSize,
  addToCartHandlers,
  onNotifyMeOpen,
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

      // Select first available (not out of stock) size when dialog opens
      if (product.sizes && product.sizes.length > 0) {
        const firstAvailableSize = product.sizes.find(
          size => !outOfStock?.[size.sizeId || 0]
        );
        if (firstAvailableSize && firstAvailableSize.sizeId) {
          handleSelectSize(firstAvailableSize.sizeId);
        }
      }
    } else {
      // Deselect all sizes when dialog closes
      handleSelectSize(0);
    }
    setOpen(isOpen);
  };

  // Wrap the handleAddToCart to close the dialog after button press
  const wrappedHandlers = addToCartHandlers ? {
    ...addToCartHandlers,
    handleAddToCart: async () => {
      if (!addToCartHandlers.handleAddToCart) {
        return false;
      }

      try {
        const result = await addToCartHandlers.handleAddToCart();
        // Close dialog after successful add
        if (result) {
          setOpen(false);
        }
        return result;
      } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
      }
    },
    onDialogAction: () => {
      setOpen(false); // Close measurements dialog when notify me or other dialog opens
    },
    onNotifyMeOpen: () => {
      setOpen(false); // Close measurements dialog
      // Delay opening NotifyMe to ensure measurements dialog closes first
      setTimeout(() => {
        onNotifyMeOpen?.(); // Open parent's NotifyMe dialog
      }, 150);
    },
  } : undefined;

  return (
    <DialogPrimitives.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          {t("size guide")}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-[155] h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2 bottom-0 top-2 z-[156] flex flex-col border border-b-0 border-textInactiveColor bg-bgColor text-textColor outline-none focus:outline-none">
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>

          {/* Header */}
          <div className="flex items-center justify-between p-2.5">
            <Text variant="uppercase">{t("size guide")}</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-32">
            <Measurements
              product={product}
              selectedSize={selectedSize}
              outOfStock={outOfStock}
              isOneSize={isOneSize}
              handleSelectSize={handleSelectSize}
            />
          </div>

          {/* Fixed Add to Cart Button at Bottom */}
          <div className="border-t border-textInactiveColor">
            <AddToCartBtn product={product} handlers={wrappedHandlers} />
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
  onNotifyMeOpen?: () => void;
  addToCartHandlers?: {
    activeSizeId?: number;
    isLoading?: boolean;
    outOfStock?: Record<number, boolean>;
    sizeQuantity?: Record<number, number>;
    isMaxQuantity?: boolean;
    hoveredOutOfStockSizeId?: number | null;
    shouldBlinkSizes?: boolean;
    handleSizeSelect?: (sizeId: number) => void | Promise<boolean | void>;
    handleAddToCart?: () => Promise<boolean>;
    triggerSizeBlink?: () => void;
    onDialogAction?: () => void;
  };
};
