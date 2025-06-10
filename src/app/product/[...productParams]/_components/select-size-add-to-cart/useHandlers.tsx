import { useRef, useState } from "react";

import { useCart } from "@/lib/stores/cart/store-provider";

import { useDisabled } from "./useDisabled";

interface Props {
  id: number;
  onSizeAccordionStateChange?: (isOpen: boolean) => void | undefined;
}

export function useHandlers({ id, onSizeAccordionStateChange }: Props) {
  const { increaseQuantity, openCart } = useCart((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const { isMaxQuantity } = useDisabled({ id, activeSizeId });
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [pendingAddToCart, setPendingAddToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const triggerDialodRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = async () => {
    if (isMaxQuantity) return false;

    if (!activeSizeId) {
      onAccordionChange("size");
      if (window.innerWidth < 1024 && triggerDialodRef?.current) {
        triggerDialodRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        triggerDialodRef.current.click();
      }
      setPendingAddToCart(true);
      return false;
    }

    try {
      await increaseQuantity(id, activeSizeId?.toString() || "", 1);
      setOpenItem("");
      openCart();
      return true;
    } catch (error) {
      return false;
    }
  };

  const onAccordionChange = (value: string | undefined) => {
    setOpenItem(value);
    onSizeAccordionStateChange?.(value === "size");
  };

  const handleSizeSelect = async (sizeId: number) => {
    setActiveSizeId(sizeId);
    onAccordionChange("");

    if (pendingAddToCart) {
      setPendingAddToCart(false);
      setIsLoading(true);
      try {
        await increaseQuantity(id, sizeId.toString(), 1);
        openCart();
        return true;
      } catch (error) {
        return false;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    activeSizeId,
    openItem,
    isLoading,
    triggerDialodRef,
    handleAddToCart,
    handleSizeSelect,
    onAccordionChange,
    setActiveSizeId,
  };
}
