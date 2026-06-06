import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { sendAddToCartEvent } from "@/lib/analitycs/cart";
import { getErrorMessage } from "@/lib/error-message";
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
  const tToaster = useTranslations("toaster");
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSizeDialogOpen, setIsMobileSizeDialogOpen] = useState(false);
  const [shouldBlinkSizes, setShouldBlinkSizes] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const maxOrderItems = dictionary?.maxOrderItems || 3;

  const { productCategory, productSubCategory } = useProductBasics({
    product: product as common_ProductFull,
  });

  useEffect(() => {
    if (isOneSize && sizeNames?.length === 1 && !activeSizeId) {
      setActiveSizeId(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, activeSizeId]);

  const showErrorToast = (error: unknown) => {
    setToastMessage(getErrorMessage(error, tToaster("validation_error")));
    setToastOpen(true);
  };

  const handleAddToCart = async () => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 1024;

    if (isMobile) {
      if (isOneSize && sizeNames?.length === 1) {
        return handleSizeSelect(sizeNames[0].id, { addToCart: true });
      }

      if (activeSizeId) {
        return handleSizeSelect(activeSizeId, { addToCart: true });
      }

      setIsMobileSizeDialogOpen(true);
      return false;
    }

    if (!activeSizeId) {
      return false;
    }

    try {
      const currency = currentCountry.currencyKey || "EUR";
      const success = await increaseQuantity(
        id,
        activeSizeId?.toString() || "",
        1,
        currency,
        maxOrderItems,
      );

      if (!success) {
        return false;
      }

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
      showErrorToast(error);
      return false;
    }
  };

  const handleSizeSelect = async (
    sizeId: number,
    options?: { addToCart?: boolean },
  ) => {
    const fromMobileDialog = isMobileSizeDialogOpen;
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 1024;

    if (!fromMobileDialog && isMobile && !options?.addToCart) {
      setActiveSizeId(sizeId);
      return true;
    }

    setIsLoading(true);
    setActiveSizeId(sizeId);
    setIsMobileSizeDialogOpen(false);

    if (fromMobileDialog || options?.addToCart) {
      try {
        const currency = currentCountry.currencyKey || "EUR";
        const success = await increaseQuantity(
          id,
          sizeId.toString(),
          1,
          currency,
          maxOrderItems,
        );

        if (!success) {
          return false;
        }

        if (product && currency) {
          sendAddToCartEvent(
            product,
            productCategory || "",
            productSubCategory || "",
            currentCountry.currencyKey || "EUR",
          );
        }

        openCart();
        setActiveSizeId(undefined);
        return true;
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        showErrorToast(error);
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

  const triggerSizeBlink = () => {
    setShouldBlinkSizes(true);
    setTimeout(() => {
      setShouldBlinkSizes(false);
    }, 400);
  };

  return {
    activeSizeId,
    isLoading,
    isMobileSizeDialogOpen,
    shouldBlinkSizes,
    toastOpen,
    toastMessage,
    setToastOpen,
    setActiveSizeId,
    handleAddToCart,
    handleSizeSelect,
    handleDialogClose,
    triggerSizeBlink,
  };
}
