"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import { useEffect, useRef, useState } from "react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";
import { sendViewItemEvent } from "@/lib/analitycs/product";
import { useElementHeight } from "@/lib/hooks/useBottomSheet";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { GarmentDescription } from "./garmentDescription";
import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
import { MobileMeasurements } from "./mobile-measurements";
import { NotifyMe } from "./notify-me";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
import { useMeasurementSizes } from "./utils/useMeasurementSizes";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductSizes } from "./utils/useProductSizes";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const [hoveredOutOfStockSizeId, setHoveredOutOfStockSizeId] = useState<
    number | null
  >(null);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);

  const { name, productId, productCategory, productSubCategory } =
    useProductBasics({ product });

  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });

  const {
    activeSizeId,
    isLoading,
    isMobileSizeDialogOpen,
    shouldBlinkSizes,
    handleDialogClose,
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

  const { currentCountry } = useTranslationsStore((s) => s);

  const { outOfStock, isMaxQuantity } = useDisabled({
    id: productId,
    activeSizeId,
    product,
  });

  const { selectedSize, handleSelectSize } = useMeasurementSizes({ product });

  // Ensure selecting a size inside Measurements affects the main fixed AddToCart button state
  const handleSelectSizeFromMeasurements = (size: number) => {
    handleSelectSize(size);
    setActiveSizeId(size);
  };

  const containerRef = useRef<HTMLDivElement>(null!);
  const mainAreaRef = useRef<HTMLDivElement>(null!);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselHeight = useElementHeight(carouselContainerRef, 48);

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
    <div className="relative h-full overflow-y-hidden">
      <NotifyMe
        id={productId}
        open={isNotifyMeOpen}
        onOpenChange={setIsNotifyMeOpen}
        sizeNames={sizeNames}
        outOfStock={outOfStock}
        activeSizeId={activeSizeId}
      />

      <div ref={mainAreaRef} className="fixed inset-x-0 bottom-0 top-12">
        <div className="relative h-full">
          <div ref={carouselContainerRef} className="relative">
            <MobileImageCarousel media={product.media || []} />
          </div>

          <BottomSheet
            config={{
              minHeight: carouselHeight,
            }}
            mainAreaRef={mainAreaRef}
            containerRef={containerRef}
          >
            <Text variant="uppercase">{name}</Text>

            <div className="space-y-12">
              <GarmentDescription product={product} />

              <div className="space-y-12">
                <MobileMeasurements
                  product={product}
                  selectedSize={selectedSize || 0}
                  outOfStock={outOfStock}
                  isOneSize={isOneSize}
                  handleSelectSize={handleSelectSizeFromMeasurements}
                />

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

              {product.product && (
                <LastViewedProducts product={product.product} />
              )}
            </div>
          </BottomSheet>
        </div>
      </div>

      <AddToCartBtn
        product={product}
        handlers={{
          activeSizeId,
          isLoading,
          outOfStock,
          isMobileSizeDialogOpen,
          sizeQuantity,
          isMaxQuantity,
          shouldBlinkSizes,
          handleDialogClose,
          handleSizeSelect,
          handleAddToCart,
          hoveredOutOfStockSizeId,
          triggerSizeBlink,
        }}
      />
    </div>
  );
}
