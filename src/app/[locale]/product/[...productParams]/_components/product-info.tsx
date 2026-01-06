"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import { useEffect, useRef, useState } from "react";

import Modal from "@/app/[locale]/product/[...productParams]/_components/MeasurementPopup";
import { Text } from "@/components/ui/text";
import { sendViewItemEvent } from "@/lib/analitycs/product";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { GarmentDescription } from "./garmentDescription";
import { Measurements } from "./measurements";
import { NotifyMe } from "./notify-me";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
import { useMeasurementSizes } from "./utils/useMeasurementSizes";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductSizes } from "./utils/useProductSizes";

export function ProductInfo({ product }: { product: common_ProductFull }) {
  const sizePickerRef = useRef<HTMLDivElement>(null);
  const [hoveredOutOfStockSizeId, setHoveredOutOfStockSizeId] = useState<
    number | null
  >(null);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);
  const [isMeasurementPopupOpen, setIsMeasurementPopupOpen] = useState(false);

  const { currentCountry } = useTranslationsStore((s) => s);
  const { name, productId, productCategory, productSubCategory } =
    useProductBasics({
      product,
    });
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const {
    activeSizeId,
    isLoading,
    shouldBlinkSizes,
    handleSizeSelect,
    handleAddToCart,
    setActiveSizeId,
    triggerSizeBlink,
  } = useHandlers({
    id: productId,
    sizeNames,
    isOneSize,
    product,
  });
  const { outOfStock, isMaxQuantity } = useDisabled({
    id: productId,
    activeSizeId,
    product,
  });
  const { selectedSize, handleSelectSize, handleMeasurementSizes } =
    useMeasurementSizes({ product });

  const handleNotifyMeOpen = () => {
    if (selectedSize) {
      setActiveSizeId(selectedSize);
    }
    setIsNotifyMeOpen(true);
  };

  useEffect(() => {
    if (product) {
      sendViewItemEvent(
        product,
        productCategory || "",
        productSubCategory || "",
        currentCountry.currencyKey || "EUR",
      );
    }
  }, [product]);

  return (
    <div className="relative">
      <NotifyMe
        id={productId}
        open={isNotifyMeOpen}
        onOpenChange={setIsNotifyMeOpen}
        sizeNames={sizeNames}
        outOfStock={outOfStock}
        activeSizeId={activeSizeId}
      />
      <div className="border-inactive absolute bottom-2.5 right-2.5 h-fit max-h-[566px] w-[300px] overflow-y-scroll border bg-bgColor p-2.5">
        <div className="flex flex-col justify-between gap-16">
          <Text variant="uppercase">{name}</Text>
          <GarmentDescription product={product} />
          <div className="space-y-5">
            <Modal
              product={product}
              handleAddToCart={handleMeasurementSizes}
              selectedSize={selectedSize}
              outOfStock={outOfStock}
              onNotifyMeOpen={handleNotifyMeOpen}
              onOpenChange={setIsMeasurementPopupOpen}
            >
              <Measurements
                product={product}
                selectedSize={selectedSize || 0}
                outOfStock={outOfStock}
                isOneSize={isOneSize}
                handleSelectSize={handleSelectSize}
              />
            </Modal>
            <div ref={sizePickerRef}>
              <SizePicker
                sizeNames={sizeNames || []}
                activeSizeId={activeSizeId || 0}
                outOfStock={outOfStock}
                sizeQuantity={sizeQuantity}
                isOneSize={isOneSize}
                handleSizeSelect={handleSizeSelect}
                view={isOneSize ? "line" : "grid"}
                onOutOfStockHover={setHoveredOutOfStockSizeId}
                shouldBlink={shouldBlinkSizes}
              />
            </div>
          </div>
          {!isMeasurementPopupOpen && (
            <AddToCartBtn
              product={product}
              handlers={{
                activeSizeId,
                isLoading,
                outOfStock,
                sizePickerRef,
                isMaxQuantity,
                hoveredOutOfStockSizeId,
                shouldBlinkSizes,
                handleSizeSelect,
                handleAddToCart,
                triggerSizeBlink,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
