import { useState } from "react";

import { useCart } from "@/lib/stores/cart/store-provider";

import { useDisabled } from "./useDisabled";

interface Props {
  id: number;
  onSizeAccordionStateChange: (isOpen: boolean) => void;
}

export function useHandlers({ id, onSizeAccordionStateChange }: Props) {
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const { isMaxQuantity } = useDisabled({ id, activeSizeId });
  const { increaseQuantity } = useCart((state) => state);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [pendingAddToCart, setPendingAddToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (isMaxQuantity) return;

    if (!activeSizeId) {
      onAccordionChange("size");
      setPendingAddToCart(true);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await increaseQuantity(id, activeSizeId?.toString() || "", 1);
    } finally {
      setIsLoading(false);
      setOpenItem("");
    }
  };

  const onAccordionChange = (value: string | undefined) => {
    setOpenItem(value);
    onSizeAccordionStateChange(value === "size");
  };

  const handleSizeSelect = async (sizeId: number) => {
    setActiveSizeId(sizeId);
    onAccordionChange("");

    if (pendingAddToCart) {
      setPendingAddToCart(false);
      setIsLoading(true);
      try {
        await increaseQuantity(id, sizeId.toString(), 1);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    activeSizeId,
    openItem,
    isLoading,
    handleAddToCart,
    handleSizeSelect,
    onAccordionChange,
    setActiveSizeId,
  };
}
