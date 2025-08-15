"use client";

import { useRef } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import Modal from "@/components/ui/modal";
import { Text } from "@/components/ui/text";

import { GarmentDescription } from "./garmentDescription";
import { Measurements } from "./measurements";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { SizePicker } from "./size-picker";
import { useDisabled } from "./utils/useDisabled";
import { useHandlers } from "./utils/useHandlers";
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
    });
  const { outOfStock } = useDisabled({ id: productId, activeSizeId, product });

  return (
    <div className="relative">
      <div className="border-inactive absolute bottom-2.5 right-2.5 h-fit max-h-[566px] w-[300px] overflow-y-scroll border bg-bgColor p-2.5">
        <div className="flex flex-col justify-between gap-16">
          <Text variant="uppercase">{name}</Text>
          <GarmentDescription product={product} />
          <div className="space-y-5">
            <Modal
              overlayProps={{
                cover: "screen",
              }}
              openElement="size guide"
              title="size guide"
              className="fixed bottom-0 left-auto right-0 top-0 h-screen w-[600px] p-2.5"
            >
              <Measurements id={productId} product={product} />
            </Modal>
            <div ref={sizePickerRef}>
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
