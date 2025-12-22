import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { sendAddToCartEvent } from "@/lib/analitycs/cart";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

import { useProductBasics } from "./useProductBasics";

export function useHandlers({
  id,
  sizeNames,
  isOneSize,
  product,
}: {
  id: number;
  sizeNames?: { name: string; id: number }[];
  isOneSize?: boolean;
  product?: common_ProductFull;
}) {
  const { increaseQuantity, openCart } = useCart((state) => state);
  const { currentCountry } = useTranslationsStore((s) => s);
  const { dictionary } = useDataContext();
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSizeDialogOpen, setIsMobileSizeDialogOpen] = useState(false);

  const maxOrderItems = dictionary?.maxOrderItems || 3;

  const { productCategory, productSubCategory } = useProductBasics({
    product: product as common_ProductFull,
  });

  // Auto-select size for one-size products
  useEffect(() => {
    if (isOneSize && sizeNames && sizeNames.length === 1 && !activeSizeId) {
      setActiveSizeId(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, activeSizeId]);

  const handleAddToCart = async () => {
    if (!activeSizeId) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsMobileSizeDialogOpen(true);
      }
      return false;
    }

    try {
      const currency = currentCountry.currencyKey || "EUR";
      await increaseQuantity(
        id,
        activeSizeId?.toString() || "",
        1,
        currency,
        maxOrderItems,
      );

      if (product && currency) {
        sendAddToCartEvent(
          product,
          productCategory || "",
          productSubCategory || "",
          currentCountry.currencyKey || "EUR",
        );
      }

      openCart();
      return true;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return false;
    }
  };

  const handleSizeSelect = async (sizeId: number) => {
    setIsLoading(true);
    setActiveSizeId(sizeId);
    setIsMobileSizeDialogOpen(false);

    if (isMobileSizeDialogOpen) {
      try {
        const currency = currentCountry.currencyKey || "EUR";
        await increaseQuantity(
          id,
          sizeId.toString(),
          1,
          currency,
          maxOrderItems,
        );

        if (product && currency) {
          sendAddToCartEvent(
            product,
            productCategory || "",
            productSubCategory || "",
            currentCountry.currencyKey || "EUR",
          );
        }

        openCart();
        return true;
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(false);
    return true;
  };

  const handleDialogClose = () => {
    setIsMobileSizeDialogOpen(false);
  };

  return {
    activeSizeId,
    isLoading,
    isMobileSizeDialogOpen,
    setActiveSizeId,
    handleAddToCart,
    handleSizeSelect,
    handleDialogClose,
  };
}
