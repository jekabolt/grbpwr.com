"use client";

import { useEffect } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import MobilePlate from "@/components/ui/mobile-plate";
import { Text } from "@/components/ui/text";
import { MobileMeasurements } from "@/app/product/[...productParams]/_components/mobile-measurements";

import { GarmentDescription } from "./garmentDescription";
import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
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
      <div className="fixed inset-x-0 top-12">
        <MobileImageCarousel media={product.media || []} />
      </div>
      <MobilePlate>
        <Text variant="uppercase">{name}</Text>
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
