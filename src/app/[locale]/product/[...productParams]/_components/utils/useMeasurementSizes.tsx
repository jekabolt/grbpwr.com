"use client";

import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

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
  const { currentCountry } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    sizes && sizes.length > 0 ? sizes[0].sizeId : undefined,
  );
  const maxOrderItems = dictionary?.maxOrderItems || 3;

  // Auto-select size for one-size products
  useEffect(() => {
    if (isOneSize && sizeNames && sizeNames.length === 1 && !selectedSize) {
      setSelectedSize(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, selectedSize]);

  const handleSelectSize = (sizeId: number) => {
    setSelectedSize(sizeId);
  };

  // Convert sizeId to productSizeId for measurements
  const getProductSizeId = (sizeId: number): number | undefined => {
    return sizes?.find((s) => s.sizeId === sizeId)?.id;
  };

  async function handleMeasurementSizes() {
    if (!selectedSize) return false;

    try {
      const currency = currentCountry.currencyKey || "EUR";
      const success = await increaseQuantity(
        productId,
        selectedSize?.toString() || "",
        1,
        currency,
        maxOrderItems,
      );
      return success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return {
    selectedSize,
    selectedProductSizeId: selectedSize
      ? getProductSizeId(selectedSize)
      : undefined,
    handleSelectSize,
    handleMeasurementSizes,
  };
}
