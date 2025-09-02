"use client";

import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";

import { useProductBasics } from "./useProductBasics";
import { useProductSizes } from "./useProductSizes";

export function useMeasurementSizes({
  product,
}: {
  product: common_ProductFull;
}) {
  const { productId } = useProductBasics({ product });
  const { sizes, sizeNames, isOneSize } = useProductSizes({ product });
  const { increaseQuantity } = useCart((state) => state);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    sizes && sizes.length > 0 ? sizes[0].sizeId : undefined,
  );

  // Auto-select size for one-size products
  useEffect(() => {
    if (isOneSize && sizeNames && sizeNames.length === 1 && !selectedSize) {
      setSelectedSize(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, selectedSize]);

  const handleSelectSize = (sizeId: number) => {
    setSelectedSize(sizeId);
  };

  async function handleMeasurementSizes() {
    if (!selectedSize) return false;

    try {
      await increaseQuantity(productId, selectedSize?.toString() || "", 1);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return {
    selectedSize,
    handleSelectSize,
    handleMeasurementSizes,
  };
}
