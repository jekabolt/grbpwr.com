import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import {
  sendSizeGuideClickEvent,
  sendSizeGuideViewEvent,
} from "@/lib/analitycs/product-engagement";
import { ModalTransition } from "@/components/modal-transition";
import { Text } from "@/components/ui/text";

import { Button } from "../../../../../components/ui/button";
import { SubmissionToaster } from "../../../../../components/ui/toaster";
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
  isMaxQuantity,
}: MobileMeasurementsProps) {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(
    undefined,
  );
  const [maxOrderLimitExceededToastOpen, setMaxOrderLimitExceededToastOpen] =
    useState(false);
  const { preorder, name, productCategory } = useProductBasics({ product });
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
      const productId = product.product?.sku || "";
      const pageLocation =
        typeof window !== "undefined" ? window.location.pathname : "";
      sendSizeGuideClickEvent({
        product_id: productId,
        page_location: pageLocation,
      });
      sendSizeGuideViewEvent({
        product_id: productId,
        product_name: name,
        product_category: productCategory || "",
        page_location:
          typeof window !== "undefined" ? window.location.href : "",
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

    if (isMaxQuantity) {
      setToastMessage(t("order limit exceeded"));
      setMaxOrderLimitExceededToastOpen(true);
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
        <ModalTransition
          isOpen={open}
          contentSlideFrom="bottom"
          contentClassName="fixed inset-2 z-50 flex flex-col gap-4 overflow-hidden border border-textInactiveColor bg-bgColor p-2.5"
          content={
            <DialogPrimitives.Content className="flex h-full flex-col gap-4">
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
                  className={isMaxQuantity ? "justify-center" : undefined}
                  onAction={handleButtonClick}
                >
                  <Text
                    variant="inherit"
                    className={
                      isMaxQuantity ? "w-full text-center uppercase" : undefined
                    }
                  >
                    {isSelectedSizeOutOfStock
                      ? t("notify me")
                      : isMaxQuantity
                        ? t("order limit exceeded")
                        : preorder
                          ? t("preorder")
                          : t("add")}
                  </Text>
                  {!isSelectedSizeOutOfStock &&
                    !isMaxQuantity &&
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
          }
        />
      </DialogPrimitives.Portal>
      <SubmissionToaster
        open={maxOrderLimitExceededToastOpen}
        message={toastMessage}
        onOpenChange={setMaxOrderLimitExceededToastOpen}
      />
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
  isMaxQuantity?: boolean;
};
