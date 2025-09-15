import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { LoadingButton } from "../loading-button";
import { useHandlers } from "../utils/useHandlers";
import { useProductBasics } from "../utils/useProductBasics";
import { useProductPricing } from "../utils/useProductPricing";
import { MobileSelectSize } from "./mobile-select-size";

type Handlers = {
  activeSizeId?: number;
  openItem?: string | undefined;
  isLoading?: boolean;
  isMobileSizeDialogOpen?: boolean;
  sizePickerRef?: React.RefObject<HTMLDivElement | null>;
  handleSizeSelect?: (sizeId: number) => void | Promise<boolean | void>;
  handleAddToCart?: () => Promise<boolean>;
  handleDialogClose?: () => void;
  toggleMeasurementPopup?: () => void; // New prop
};

export function AddToCartBtn({
  product,
  handlers,
}: {
  product: common_ProductFull;
  handlers?: Handlers;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const internalHandlers = useHandlers({
    id: product.product?.id || 0,
    product,
  });
  const merged = handlers
    ? { ...internalHandlers, ...handlers }
    : internalHandlers;

  const {
    activeSizeId,
    openItem,
    isLoading,
    sizePickerRef,
    handleSizeSelect,
    handleAddToCart,
    isMobileSizeDialogOpen,
    handleDialogClose,
  } = merged as Required<Handlers> & ReturnType<typeof useHandlers>;

  const { preorder, preorderRaw } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const isValidPreorder = preorder && isDateTodayOrFuture(preorderRaw || "");
  const isNoSizeSelected = !activeSizeId && isHovered;

  const handleAddToCartClick = () => {
    if (!activeSizeId && sizePickerRef?.current) {
      const scrollableContainer = sizePickerRef.current.closest(
        ".overflow-y-scroll",
      ) as HTMLElement;

      if (scrollableContainer) {
        const sizePickerElement = sizePickerRef.current as HTMLElement;
        const offsetTop = sizePickerElement.offsetTop;

        scrollableContainer.scrollTo({
          top: offsetTop - 16,
          behavior: "smooth",
        });
      }
    }
    return handleAddToCart?.();
  };

  return (
    <>
      <MobileSelectSize
        product={product}
        activeSizeId={activeSizeId}
        handleSizeSelect={handleSizeSelect}
        open={isMobileSizeDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <div
        className={cn("fixed inset-x-5 bottom-2.5 z-10 grid lg:sticky", {
          "lg:hidden": openItem,
          "bg-bgColor": preorder,
        })}
      >
        <div>
          {preorder && isDateTodayOrFuture(preorderRaw || "") && (
            <Text className="bg-[#F0F0F0] p-1.5 text-center uppercase leading-none text-textColor">
              {preorder}
            </Text>
          )}
          <LoadingButton
            variant="simpleReverse"
            size="lg"
            onAction={handleAddToCartClick}
            isLoadingExternal={isLoading}
            className="border-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isNoSizeSelected ? (
              <Text className="w-full text-center" variant="inherit">
                select size
              </Text>
            ) : (
              <>
                <Text variant="inherit">
                  {isValidPreorder ? "preorder" : "add"}
                </Text>
                {isSaleApplied ? (
                  <Text variant="inactive">
                    {priceMinusSale}
                    <Text component="span">{priceWithSale}</Text>
                  </Text>
                ) : (
                  <Text variant="inherit">{price}</Text>
                )}
              </>
            )}
          </LoadingButton>
        </div>
      </div>
    </>
  );
}
