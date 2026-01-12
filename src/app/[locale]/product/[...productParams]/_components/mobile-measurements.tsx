import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { sendButtonEvent } from "@/lib/analitycs/button";
import { Text } from "@/components/ui/text";

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

  const isSelectedSizeOutOfStock =
    selectedSize !== undefined &&
    selectedSize !== null &&
    outOfStock?.[selectedSize];

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
        <DialogPrimitives.Content className="fixed inset-2 z-40 flex flex-col gap-4 overflow-hidden border border-textInactiveColor bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>

          <div className="relative flex shrink-0 items-center justify-between">
            <Text variant="uppercase">{t("size guide")}</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="min-h-0 grow overflow-y-auto">
            <Measurements
              product={product}
              selectedSize={selectedSize}
              outOfStock={outOfStock}
              isOneSize={isOneSize}
              handleSelectSize={handleSelectSize}
            />
          </div>
          <div className="shrink-0">
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
