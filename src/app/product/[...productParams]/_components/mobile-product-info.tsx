"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";

import { MobileMeasurements } from "@/components/ui/mobile-measurements";
import MobilePlate from "@/components/ui/mobile-plate";
import { Text } from "@/components/ui/text";

import { GarmentDescription } from "./garmentDescription";
import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductSizes } from "./utils/useProductSizes";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const { name, productId } = useProductBasics({ product });

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

  return (
    <div className="relative h-full overflow-y-hidden">
      <div className="fixed inset-x-0 top-12">
        <MobileImageCarousel media={product.media || []} />
      </div>
      <MobilePlate>
        <Text variant="uppercase">{name}</Text>
        <GarmentDescription product={product} />

        <div className="space-y-5">
          <MobileMeasurements id={productId} product={product} />

          <SizePicker
            sizeNames={sizeNames || []}
            activeSizeId={activeSizeId || 0}
            outOfStock={outOfStock}
            sizeQuantity={sizeQuantity}
            isOneSize={isOneSize}
            handleSizeSelect={handleSizeSelect}
          />
        </div>

        {product.product && <LastViewedProducts product={product.product} />}
      </MobilePlate>
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
