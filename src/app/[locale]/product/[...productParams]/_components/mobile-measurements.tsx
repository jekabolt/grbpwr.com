import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/ui/text";
import { sendButtonEvent } from "@/lib/analitycs/button";

import { Button } from "../../../../../components/ui/button";
import { LoadingButton } from "./loading-button";
import { Measurements } from "./measurements";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductPricing } from "./utils/useProductPricing";

export function MobileMeasurements({
  product,
  selectedSize,
  outOfStock,
  isOneSize,
  handleAddToCart,
  handleSelectSize,
  onNotifyMeOpen,
}: MobileMeasurementsProps) {
  const [open, setOpen] = useState(false);
  const { preorder, name } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const t = useTranslations("product");
  const tAccessibility = useTranslations("accessibility");

  const isSelectedSizeOutOfStock = selectedSize !== undefined && selectedSize !== null && outOfStock?.[selectedSize];

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      sendButtonEvent({
        buttonId: "size_guide",
        productName: name,
      });
    }
    setOpen(isOpen);
  };

  const handleButtonClick = async () => {
    if (isSelectedSizeOutOfStock) {
      setOpen(false);
      setTimeout(() => {
        onNotifyMeOpen?.();
      }, 100);
      return false;
    }
    setOpen(false);
    const success = await handleAddToCart();
    return success;
  };

  return (
    <DialogPrimitives.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          {t("size guide")}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2 bottom-2 top-2 z-40 flex flex-col gap-4 overflow-y-auto border border-textInactiveColor bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col">
            <div className="relative mb-10 flex shrink-0 items-center justify-between">
              <Text variant="uppercase">{t("size guide")}</Text>
              <DialogPrimitives.Close asChild>
                <Button>[x]</Button>
              </DialogPrimitives.Close>
            </div>
            <div className="flex-1">
              <Measurements
                product={product}
                selectedSize={selectedSize}
                outOfStock={outOfStock}
                isOneSize={isOneSize}
                handleSelectSize={handleSelectSize}
              />
            </div>
            <div className="mt-auto shrink-0 space-y-6 pt-6">
              <LoadingButton
                variant="simpleReverse"
                size="lg"
                onAction={handleButtonClick}
              >
                <Text variant="inherit">
                  {isSelectedSizeOutOfStock
                    ? t("notify me")
                    : preorder
                      ? t("preorder")
                      : t("add")}
                </Text>
                {!isSelectedSizeOutOfStock &&
                  (isSaleApplied ? (
                    <Text variant="inactive">
                      {priceMinusSale}
                      <Text component="span">{priceWithSale}</Text>
                    </Text>
                  ) : (
                    <Text variant="inherit">{price}</Text>
                  ))}
              </LoadingButton>
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
  handleAddToCart: () => Promise<boolean>;
  handleSelectSize: (size: number) => void;
  onNotifyMeOpen?: () => void;
};
