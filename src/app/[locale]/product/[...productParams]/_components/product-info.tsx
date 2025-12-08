"use client";

import { useEffect, useRef, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { sendViewItemEvent } from "@/lib/analitycs/product";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Text } from "@/components/ui/text";
import Modal from "@/app/[locale]/product/[...productParams]/_components/MeasurementPopup";

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
  const [hoveredOutOfStockSizeId, setHoveredOutOfStockSizeId] = useState<
    number | null
  >(null);

  const { selectedCurrency } = useCurrency((state) => state);
  const { name, productId, productCategory, productSubCategory } =
    useProductBasics({
      product,
    });
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const { activeSizeId, isLoading, handleSizeSelect, handleAddToCart } =
    useHandlers({
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

  useEffect(() => {
    if (product) {
      sendViewItemEvent(
        product,
        productCategory || "",
        productSubCategory || "",
        selectedCurrency,
      );
    }
  }, [product]);

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
                onOutOfStockHover={setHoveredOutOfStockSizeId}
              />
            </div>
          </div>
          <AddToCartBtn
            product={product}
            handlers={{
              activeSizeId,
              isLoading,
              outOfStock,
              sizePickerRef,
              isMaxQuantity,
              handleSizeSelect,
              handleAddToCart,
              hoveredOutOfStockSizeId,
            }}
          />
        </div>
      </div>
    </div>
  );
}
