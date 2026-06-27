"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import {
  sendSizeGuideClickEvent,
  sendSizeGuideViewEvent,
} from "@/lib/analitycs/product-engagement";
import { ModalTransition } from "@/components/modal-transition";
import { LoadingButton } from "@/app/[locale]/product/[...productParams]/_components/loading-button";
import { useProductBasics } from "@/app/[locale]/product/[...productParams]/_components/utils/useProductBasics";
import { useProductPricing } from "@/app/[locale]/product/[...productParams]/_components/utils/useProductPricing";

import { Button } from "../../../../../components/ui/button";
import { Text } from "../../../../../components/ui/text";
import { SubmissionToaster } from "../../../../../components/ui/toaster";

interface ModalProps {
  children: React.ReactNode;
  product: common_ProductFull;
  handleAddToCart: () => Promise<boolean>;
  selectedSize?: number;
  outOfStock?: Record<number, boolean>;
  isMaxQuantity?: boolean;
  onNotifyMeOpen?: () => void;
}

export default function MeasurementPopup({
  children,
  product,
  handleAddToCart,
  selectedSize,
  outOfStock,
  isMaxQuantity,
  onNotifyMeOpen,
}: ModalProps) {
  const { preorder, name, productCategory } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const t = useTranslations("product");
  const tNav = useTranslations("navigation");

  const [isModalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(
    undefined,
  );
  const [maxOrderLimitExceededToastOpen, setMaxOrderLimitExceededToastOpen] =
    useState(false);
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
        product_name: name || "",
        product_category: productCategory || "",
        page_location:
          typeof window !== "undefined" ? window.location.href : "",
      });
    }
    setModalOpen(isOpen);
  };

  async function handleAddToCartComplete() {
    if (isSelectedSizeOutOfStock) {
      setModalOpen(false);
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

    setModalOpen(false);
    const success = await handleAddToCart();
    return success;
  }

  return (
    <DialogPrimitives.Root open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitives.Trigger asChild>
        <Button variant="underline" className="uppercase">
          {t("size guide")}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen bg-overlay" />
        <ModalTransition
          isOpen={isModalOpen}
          contentSlideFrom="right"
          contentClassName="fixed inset-y-2 right-2 z-50 w-[600px] border border-textInactiveColor bg-bgColor p-2.5"
          content={
            <DialogPrimitives.Content className="flex h-full flex-col gap-y-2">
              <DialogPrimitives.Title className="sr-only">
                {t("size guide")}
              </DialogPrimitives.Title>
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{t("size guide")}</Text>
                <DialogPrimitives.Close asChild>
                  <Button
                    aria-label={tNav("close")}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center"
                  >
                    [x]
                  </Button>
                </DialogPrimitives.Close>
              </div>
              <div className="h-full overflow-y-scroll">{children}</div>
              <LoadingButton
                variant="simpleReverse"
                size="lg"
                className={isMaxQuantity ? "justify-center" : undefined}
                onAction={() => handleAddToCartComplete()}
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
