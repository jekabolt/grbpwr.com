"use client";

import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { sendButtonEvent } from "@/lib/analitycs/button";
import { LoadingButton } from "@/app/[locale]/product/[...productParams]/_components/loading-button";
import { useProductBasics } from "@/app/[locale]/product/[...productParams]/_components/utils/useProductBasics";
import { useProductPricing } from "@/app/[locale]/product/[...productParams]/_components/utils/useProductPricing";

import { Button } from "../../../../../components/ui/button";
import { Overlay } from "../../../../../components/ui/overlay";
import { Text } from "../../../../../components/ui/text";

interface ModalProps {
  children: React.ReactNode;
  product: common_ProductFull;
  handleAddToCart: () => Promise<boolean>;
  selectedSize?: number;
  outOfStock?: Record<number, boolean>;
  onNotifyMeOpen?: () => void;
}

export default function MeasurementPopup({
  children,
  product,
  handleAddToCart,
  selectedSize,
  outOfStock,
  onNotifyMeOpen,
}: ModalProps) {
  const { preorder, name } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const t = useTranslations("product");

  const [isModalOpen, setModalOpen] = useState(false);
  const isSelectedSizeOutOfStock =
    selectedSize !== undefined &&
    selectedSize !== null &&
    outOfStock?.[selectedSize];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const toggleModal = () => {
    if (!isModalOpen) {
      sendButtonEvent({
        buttonId: "size_guide",
        productName: name,
      });
    }
    setModalOpen(!isModalOpen);
  };

  async function handleAddToCartComplete() {
    if (isSelectedSizeOutOfStock) {
      setModalOpen(false);
      setTimeout(() => {
        onNotifyMeOpen?.();
      }, 100);
      return false;
    }
    setModalOpen(false);
    const success = await handleAddToCart();
    return success;
  }

  return (
    <div>
      {isModalOpen && (
        <Overlay
          cover="screen"
          disablePointerEvents={false}
          onClick={toggleModal}
        />
      )}
      <Button variant="underline" className="uppercase" onClick={toggleModal}>
        {t("size guide")}
      </Button>
      {isModalOpen && (
        <div className="fixed inset-y-2 right-2 z-50 w-[600px] border border-textInactiveColor bg-bgColor p-2.5">
          <div className="flex h-full flex-col gap-12">
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{t("size guide")}</Text>
              <Button onClick={toggleModal}>[x]</Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
            <div className="mt-auto shrink-0">
              <LoadingButton
                variant="simpleReverse"
                size="lg"
                onAction={() => handleAddToCartComplete()}
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
        </div>
      )}
    </div>
  );
}
