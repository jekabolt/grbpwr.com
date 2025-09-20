"use client";

import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

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
}

export default function MeasurementPopup({
  children,
  product,
  handleAddToCart,
}: ModalProps) {
  const { preorder } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const t = useTranslations("product");

  const [isModalOpen, setModalOpen] = useState(false);

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
    setModalOpen(!isModalOpen);
  };

  async function handleAddToCartComplete() {
    const success = await handleAddToCart();
    if (success) {
      toggleModal();
    }
    return success;
  }

  return (
    <div>
      {isModalOpen && <Overlay cover="screen" onClick={toggleModal} />}
      <Button variant="underline" className="uppercase" onClick={toggleModal}>
        {t("size guide")}
      </Button>
      {isModalOpen && (
        <div className="fixed inset-y-0 right-0 z-50 h-screen w-[600px] bg-bgColor p-2.5">
          <div className="flex h-full flex-col gap-12">
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{t("size guide")}</Text>
              <Button onClick={toggleModal}>[x]</Button>
            </div>

            {children}

            <LoadingButton
              variant="simpleReverse"
              size="lg"
              onAction={() => handleAddToCartComplete()}
            >
              <Text variant="inherit">
                {preorder ? t("preorder") : t("add")}
              </Text>
              {isSaleApplied ? (
                <Text variant="inactive">
                  {priceMinusSale}
                  <Text component="span">{priceWithSale}</Text>
                </Text>
              ) : (
                <Text variant="inherit">{price}</Text>
              )}
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
}
