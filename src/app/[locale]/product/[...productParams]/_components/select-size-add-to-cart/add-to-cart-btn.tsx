import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { LoadingButton } from "../loading-button";
import { NotifyMe } from "../notify-me";
import { useDisabled } from "../utils/useDisabled";
import { useHandlers } from "../utils/useHandlers";
import { useProductBasics } from "../utils/useProductBasics";
import { useProductPricing } from "../utils/useProductPricing";
import { useProductSizes } from "../utils/useProductSizes";
import { MobileSelectSize } from "./mobile-select-size";

type Handlers = {
  activeSizeId?: number;
  openItem?: string | undefined;
  isLoading?: boolean;
  isMobileSizeDialogOpen?: boolean;
  sizePickerRef?: React.RefObject<HTMLDivElement | null>;
  outOfStock?: Record<number, boolean>;
  sizeQuantity?: Record<number, number>;
  isMaxQuantity?: boolean;
  setActiveSizeId?: (sizeId: number) => void;
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
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);
  const { preorder, preorderRaw } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const {
    sizeNames,
    isOneSize,
    sizeQuantity: internalSizeQuantity,
  } = useProductSizes({ product });
  const internalHandlers = useHandlers({
    id: product.product?.id || 0,
    sizeNames,
    isOneSize,
    product,
  });
  const { outOfStock: internalOutOfStock } = useDisabled({
    id: product.product?.id || 0,
    activeSizeId: internalHandlers.activeSizeId,
    product,
  });
  const {
    activeSizeId,
    openItem,
    isLoading,
    sizePickerRef,
    isMobileSizeDialogOpen,
    isMaxQuantity,
    setActiveSizeId,
    handleSizeSelect,
    handleAddToCart,
    handleDialogClose,
  } = { ...internalHandlers, ...handlers };

  const outOfStock = handlers?.outOfStock ?? internalOutOfStock;
  const sizeQuantity = handlers?.sizeQuantity ?? internalSizeQuantity;
  const isValidPreorder = preorder && isDateTodayOrFuture(preorderRaw || "");
  const isNoSizeSelected = !activeSizeId && isHovered;
  const isSelectedSizeOutOfStock = activeSizeId && outOfStock?.[activeSizeId];
  const isSoldOut = product.product?.soldOut === true;
  const t = useTranslations("product");

  const handleAddToCartClick = () => {
    if (isSoldOut || isSelectedSizeOutOfStock) {
      setIsNotifyMeOpen(true);
      return Promise.resolve(false);
    }

    if (activeSizeId && sizeQuantity?.[activeSizeId] === 0) {
      return Promise.resolve(false);
    }

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
      <NotifyMe
        id={product.product?.id || 0}
        open={isNotifyMeOpen}
        onOpenChange={setIsNotifyMeOpen}
        sizeNames={sizeNames}
        outOfStock={outOfStock}
        activeSizeId={activeSizeId}
      />
      <MobileSelectSize
        product={product}
        activeSizeId={activeSizeId}
        open={isMobileSizeDialogOpen}
        outOfStock={outOfStock}
        sizeQuantity={sizeQuantity}
        handleSizeSelect={handleSizeSelect}
        onOpenChange={handleDialogClose}
        onNotifyMeOpen={(sizeId) => {
          setActiveSizeId(sizeId);
          setIsNotifyMeOpen(true);
        }}
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
            {isSoldOut || isSelectedSizeOutOfStock ? (
              <Text className="w-full text-center uppercase" variant="inherit">
                notify me
              </Text>
            ) : isNoSizeSelected ? (
              <Text className="w-full text-center" variant="inherit">
                {t("select size")}
              </Text>
            ) : isMaxQuantity ? (
              <Text className="w-full text-center uppercase" variant="inherit">
                order limit exceeded
              </Text>
            ) : (
              <>
                <Text variant="inherit">
                  {isValidPreorder ? t("preorder") : t("add")}
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
