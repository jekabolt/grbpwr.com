"use client";

import { useEffect, useRef } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { sendViewItemEvent } from "@/lib/analitycs/product";
import { useElementHeight } from "@/lib/hooks/useBottomSheet";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";

import { GarmentDescription } from "./garmentDescription";
import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
import { MobileMeasurements } from "./mobile-measurements";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
import { useMeasurementSizes } from "./utils/useMeasurementSizes";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductPricing } from "./utils/useProductPricing";
import { useProductSizes } from "./utils/useProductSizes";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const { name, productId } = useProductBasics({ product });
  const { closeCart } = useCart((state) => state);
  const { selectedCurrency } = useCurrency((s) => s);
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const {
    activeSizeId,
    isLoading,
    isMobileSizeDialogOpen,
    handleDialogClose,
    handleSizeSelect,
    handleAddToCart,
  } = useHandlers({
    id: productId,
    sizeNames,
    isOneSize,
    product,
  });
  const { outOfStock } = useDisabled({ id: productId, activeSizeId, product });
  const { selectedSize, handleSelectSize, handleMeasurementSizes } =
    useMeasurementSizes({ product });
  const { priceNumber } = useProductPricing({ product });
  const containerRef = useRef<HTMLDivElement>(null!);
  const mainAreaRef = useRef<HTMLDivElement>(null!);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselHeight = useElementHeight(carouselContainerRef, 48);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (product && selectedCurrency) {
      sendViewItemEvent(selectedCurrency, product, priceNumber);
    }
  }, [product, selectedCurrency]);

  return (
    <div className="relative h-full overflow-y-hidden">
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
              <div className="space-y-5">
                <MobileMeasurements
                  product={product}
                  selectedSize={selectedSize || 0}
                  outOfStock={outOfStock}
                  isOneSize={isOneSize}
                  handleAddToCart={handleMeasurementSizes}
                  handleSelectSize={handleSelectSize}
                />
                <SizePicker
                  sizeNames={sizeNames || []}
                  activeSizeId={activeSizeId || 0}
                  outOfStock={outOfStock}
                  sizeQuantity={sizeQuantity}
                  isOneSize={isOneSize}
                  handleSizeSelect={handleSizeSelect}
                  view={isOneSize ? "line" : "grid"}
                />
              </div>
            </div>
            {product.product && (
              <LastViewedProducts product={product.product} />
            )}
          </BottomSheet>
        </div>
      </div>
      <AddToCartBtn
        product={product}
        handlers={{
          activeSizeId,
          isLoading,
          isMobileSizeDialogOpen,
          handleDialogClose,
          handleSizeSelect,
          handleAddToCart,
        }}
      />
    </div>
  );
}
