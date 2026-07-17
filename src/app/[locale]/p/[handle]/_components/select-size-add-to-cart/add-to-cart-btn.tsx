import { useState } from "react";
import { StorefrontColorway } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

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
  hoveredOutOfStockSizeId?: number | null;
  shouldBlinkSizes?: boolean;
  setActiveSizeId?: (sizeId: number) => void;
  handleSizeSelect?: (sizeId: number) => void | Promise<boolean | void>;
  handleAddToCart?: () => Promise<boolean>;
  handleDialogClose?: () => void;
  triggerSizeBlink?: () => void;
  toggleMeasurementPopup?: () => void;
  onCollapseSheet?: () => void;
};

export function AddToCartBtn({
  product,
  handlers,
}: {
  product: StorefrontColorway;
  handlers?: Handlers;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(
    undefined,
  );
  const [maxOrderLimitExceededToastOpen, setMaxOrderLimitExceededToastOpen] =
    useState(false);
  const { preorder, preorderRaw, name, productCategory } = useProductBasics({
    product,
  });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const {
    sizeNames,
    isOneSize,
    sizeQuantity: internalSizeQuantity,
  } = useProductSizes({ product });
  const internalHandlers = useHandlers({
    sizeNames,
    isOneSize,
    product,
  });
  const {
    toastOpen: cartErrorToastOpen,
    toastMessage: cartErrorToastMessage,
    setToastOpen: setCartErrorToastOpen,
    ...internalHandlersRest
  } = internalHandlers;
  const {
    outOfStock: internalOutOfStock,
    isMaxQuantity: internalIsMaxQuantity,
  } = useDisabled({
    activeSizeId: internalHandlers.activeSizeId,
    product,
  });
  const {
    activeSizeId,
    openItem,
    isLoading,
    sizePickerRef,
    isMobileSizeDialogOpen,
    hoveredOutOfStockSizeId,
    setActiveSizeId,
    handleSizeSelect,
    handleAddToCart,
    handleDialogClose,
    triggerSizeBlink,
    onCollapseSheet,
  } = { ...internalHandlersRest, ...handlers };

  const outOfStock = handlers?.outOfStock ?? internalOutOfStock;
  const isMaxQuantityFinal = handlers?.isMaxQuantity ?? internalIsMaxQuantity;
  const sizeQuantity = handlers?.sizeQuantity ?? internalSizeQuantity;
  const isValidPreorder = preorder && isDateTodayOrFuture(preorderRaw || "");
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const isNoSizeSelected = !activeSizeId && isHovered && !isMobile;
  const isSelectedSizeOutOfStock = activeSizeId && outOfStock?.[activeSizeId];
  const isHoveringOutOfStock = hoveredOutOfStockSizeId !== null;
  const isSoldOut = product.soldOut === true;
  const t = useTranslations("product");

  const handleAddToCartClick = () => {
    if (isSoldOut || isSelectedSizeOutOfStock) {
      setIsNotifyMeOpen(true);
      return Promise.resolve(false);
    }

    if (isMaxQuantityFinal) {
      setToastMessage(t("order limit exceeded"));
      setMaxOrderLimitExceededToastOpen(true);
      return Promise.resolve(false);
    }

    if (activeSizeId && sizeQuantity?.[activeSizeId] === 0) {
      return Promise.resolve(false);
    }

    if (!activeSizeId && !isMobile) {
      onCollapseSheet?.();
      triggerSizeBlink?.();
      setToastMessage(t("select your size to continue"));
      setMaxOrderLimitExceededToastOpen(true);

      if (sizePickerRef?.current) {
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
    }
    return handleAddToCart?.();
  };

  return (
    <>
      <NotifyMe
        baseSku={product.baseSku || ""}
        open={isNotifyMeOpen}
        onOpenChange={setIsNotifyMeOpen}
        sizeNames={sizeNames}
        outOfStock={outOfStock}
        activeSizeId={activeSizeId}
        productName={name}
        productCategory={productCategory || ""}
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
        className={cn("fixed inset-x-5 bottom-2.5 z-10 grid lg:static", {
          "lg:hidden": openItem,
          "bg-bgColor": preorder,
        })}
      >
        <div>
          {preorder && isDateTodayOrFuture(preorderRaw || "") && (
            <Text className="bg-textInactiveColorAlpha p-1.5 text-center uppercase leading-none text-textColor">
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
            {isSoldOut || isSelectedSizeOutOfStock || isHoveringOutOfStock ? (
              <Text className="w-full text-center uppercase" variant="inherit">
                {t("notify me")}
              </Text>
            ) : isMaxQuantityFinal ? (
              <Text className="w-full text-center uppercase" variant="inherit">
                {t("order limit exceeded")}
              </Text>
            ) : isNoSizeSelected ? (
              <Text className="w-full text-center" variant="inherit">
                {t("select size")}
              </Text>
            ) : (
              <>
                <Text variant="inherit">
                  {isValidPreorder ? t("preorder") : t("add")}
                </Text>
                {isSaleApplied ? (
                  <Text variant="inactive">
                    {priceMinusSale}
                    <Text component="span" className="text-textColor">
                      {priceWithSale}
                    </Text>
                  </Text>
                ) : (
                  <Text variant="inherit">{price}</Text>
                )}
              </>
            )}
          </LoadingButton>
        </div>
      </div>
      <SubmissionToaster
        open={maxOrderLimitExceededToastOpen || cartErrorToastOpen}
        message={toastMessage || cartErrorToastMessage}
        onOpenChange={(open) => {
          if (!open) {
            setMaxOrderLimitExceededToastOpen(false);
            setCartErrorToastOpen(false);
          }
        }}
      />
    </>
  );
}
