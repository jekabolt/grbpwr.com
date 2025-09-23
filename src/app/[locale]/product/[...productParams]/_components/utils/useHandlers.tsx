import { useEffect, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

// import { pushAddToCartEvent } from "@/lib/gtm";
import { useCart } from "@/lib/stores/cart/store-provider";

import { useDisabled } from "./useDisabled";

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
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const { isMaxQuantity } = useDisabled({ id, activeSizeId });
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSizeDialogOpen, setIsMobileSizeDialogOpen] = useState(false);

  // Auto-select size for one-size products
  useEffect(() => {
    if (isOneSize && sizeNames && sizeNames.length === 1 && !activeSizeId) {
      setActiveSizeId(sizeNames[0].id);
    }
  }, [isOneSize, sizeNames, activeSizeId]);

  const handleAddToCart = async () => {
    if (isMaxQuantity) return false;

    if (!activeSizeId) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsMobileSizeDialogOpen(true);
      }
      return false;
    }

    try {
      await increaseQuantity(id, activeSizeId?.toString() || "", 1);

      // // Trigger GTM event after successful cart addition
      // if (product && activeSizeId) {
      //   pushAddToCartEvent(product, activeSizeId.toString(), 1);
      // }

      openCart();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSizeSelect = async (sizeId: number) => {
    setIsLoading(true);
    setActiveSizeId(sizeId);
    setIsMobileSizeDialogOpen(false);

    if (isMobileSizeDialogOpen) {
      try {
        await increaseQuantity(id, sizeId.toString(), 1);

        // // Trigger GTM event after successful cart addition
        // if (product) {
        //   pushAddToCartEvent(product, sizeId.toString(), 1);
        // }

        openCart();
        return true;
      } catch (error) {
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
    handleAddToCart,
    handleSizeSelect,
    handleDialogClose,
  };
}
