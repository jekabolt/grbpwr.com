"use client";

import { StorefrontColorway } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useDataContext } from "@/components/contexts/DataContext";
import { getErrorMessage } from "@/lib/error-message";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { useProductSizes } from "./useProductSizes";

export function useMeasurementSizes({
  product,
}: {
  product: StorefrontColorway;
}) {
  const { sizes, sizeNames, isOneSize } = useProductSizes({ product });
  const { increaseQuantity, openCart } = useCart((state) => state);
  const { currentCountry } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();
  const tToaster = useTranslations("toaster");

  const outOfStock =
    product?.variants?.reduce(
      (acc, v) => {
        acc[v.size?.skuOrd ?? 0] = v.soldOut === true;
        return acc;
      },
      {} as Record<number, boolean>,
    ) || {};

  // Resolve the public size ordinal chosen in the UI to the variant SKU the cart
  // addresses (R2/R3).
  const variantSkuForOrd = (ord: number | undefined): string | undefined =>
    sizes?.find((v) => v.size?.skuOrd === ord)?.variantSku;

  const getInitialSize = () => {
    if (!sizes || sizes.length === 0) return undefined;
    const firstInStockSize = sizes.find((v) => !v.soldOut);
    return (firstInStockSize ?? sizes[0]).size?.skuOrd;
  };

  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    getInitialSize(),
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const maxOrderItems = dictionary?.maxOrderItems || 3;

  useEffect(() => {
    if (isOneSize && sizeNames && sizeNames.length === 1 && !selectedSize) {
      setSelectedSize(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, selectedSize]);

  const handleSelectSize = (sizeOrd: number) => {
    setSelectedSize(sizeOrd);
  };

  async function handleMeasurementSizes() {
    if (!selectedSize) return false;
    const variantSku = variantSkuForOrd(selectedSize);
    if (!variantSku) return false;

    try {
      const currency = currentCountry.currencyKey || "EUR";
      const success = await increaseQuantity(
        variantSku,
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
      setToastMessage(getErrorMessage(error, tToaster("validation_error")));
      setToastOpen(true);
      return false;
    }
  }

  return {
    selectedSize,
    // The measurement rows join on the same public size ordinal, so the selected
    // ordinal is itself the measurement key (no internal variant id lookup).
    selectedProductSizeId: selectedSize,
    handleSelectSize,
    handleMeasurementSizes,
    toastOpen,
    toastMessage,
    setToastOpen,
  };
}
