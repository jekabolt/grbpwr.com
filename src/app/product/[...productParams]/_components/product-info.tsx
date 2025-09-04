"use client";

import { useRef } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";
import Modal from "@/app/product/[...productParams]/_components/MeasurementPopup";

import { GarmentDescription } from "./garmentDescription";
import { Measurements } from "./measurements";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
import { useMeasurementSizes } from "./utils/useMeasurementSizes";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductSizes } from "./utils/useProductSizes";

export function ProductInfo({ product }: { product: common_ProductFull }) {
  const sizePickerRef = useRef<HTMLDivElement>(null);
  const { name, productId } = useProductBasics({
    product,
  });
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const { activeSizeId, isLoading, handleSizeSelect, handleAddToCart } =
    useHandlers({
      id: productId,
      sizeNames,
      isOneSize,
    });
  const { outOfStock } = useDisabled({ id: productId, activeSizeId, product });
  const { selectedSize, handleSelectSize, handleMeasurementSizes } =
    useMeasurementSizes({ product });

  return (
    <div className="relative">
      <div className="border-inactive absolute bottom-2.5 right-2.5 h-fit max-h-[566px] w-[300px] overflow-y-scroll border bg-bgColor p-2.5">
        <div className="flex flex-col justify-between gap-16">
          <Text variant="uppercase">{name}</Text>
          <GarmentDescription product={product} />
          <div className="space-y-5">
            <Modal product={product} handleAddToCart={handleMeasurementSizes}>
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
              />
            </div>
          </div>
          <AddToCartBtn
            product={product}
            handlers={{
              activeSizeId,
              isLoading,
              sizePickerRef,
              handleSizeSelect,
              handleAddToCart,
            }}
          />
        </div>
      </div>
    </div>
  );
}
