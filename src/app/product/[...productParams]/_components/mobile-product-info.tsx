"use client";

import { useEffect } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
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
import { useProductSizes } from "./utils/useProductSizes";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const { name, productId } = useProductBasics({ product });
  const { closeCart } = useCart((state) => state);
  const {
    activeSizeId,
    isLoading,
    isMobileSizeDialogOpen,
    handleDialogClose,
    handleSizeSelect,
    handleAddToCart,
  } = useHandlers({
    id: productId,
  });
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const { outOfStock } = useDisabled({ id: productId, activeSizeId, product });
  const { selectedSize, handleSelectSize, handleMeasurementSizes } =
    useMeasurementSizes({ product });

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  return (
    <div className="relative h-full overflow-y-hidden">
      {/* Main content area with carousel and bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 top-12">
        {/* Image carousel area */}
        <div className="relative h-full">
          <MobileImageCarousel media={product.media || []} />

          {/* Bottom Sheet Component */}
          <BottomSheet
            initialHeight={150}
            minHeight={150}
            maxHeight={800}
            containerClassName="absolute inset-0"
          >
            <div className="h-full space-y-6 overflow-hidden px-2.5 pb-32 pt-2.5">
              <Text variant="uppercase">{name}</Text>
              <div className="space-y-12">
                <GarmentDescription product={product} />

                <div className="space-y-5">
                  <MobileMeasurements
                    product={product}
                    selectedSize={selectedSize || 0}
                    outOfStock={outOfStock}
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
                  />
                </div>
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
          isMobileSizeDialogOpen,
          handleDialogClose,
          handleSizeSelect,
          handleAddToCart,
        }}
      />
    </div>
  );
}
