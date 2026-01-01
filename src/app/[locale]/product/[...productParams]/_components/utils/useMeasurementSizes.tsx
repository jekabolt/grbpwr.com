"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";

import { useDataContext } from "@/components/contexts/DataContext";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { useProductBasics } from "./useProductBasics";
import { useProductSizes } from "./useProductSizes";

export function useMeasurementSizes({
  product,
}: {
  product: common_ProductFull;
}) {
  const { productId } = useProductBasics({ product });
  const { sizes, sizeNames, isOneSize } = useProductSizes({ product });
  const { increaseQuantity, openCart } = useCart((state) => state);
  const { currentCountry } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();

  // Calculate out of stock sizes
  const outOfStock =
    product?.sizes?.reduce(
      (acc, size) => {
        acc[size.sizeId || 0] = size.quantity?.value === "0";
        return acc;
      },
      {} as Record<number, boolean>,
    ) || {};

  // Select first in-stock size, or first size if all are out of stock
  const getInitialSize = () => {
    if (!sizes || sizes.length === 0) return undefined;
    const firstInStockSize = sizes.find(size => !outOfStock[size.sizeId || 0]);
    return firstInStockSize ? firstInStockSize.sizeId : sizes[0].sizeId;
  };

  const [selectedSize, setSelectedSize] = useState<number | undefined>(getInitialSize());
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
      if (success) {
        openCart();
      }
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
