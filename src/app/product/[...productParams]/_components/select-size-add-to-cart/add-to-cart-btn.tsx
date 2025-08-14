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
  handleSizeSelect?: (sizeId: number) => void | Promise<boolean | void>;
  handleAddToCart?: () => Promise<boolean>;
  isMobileSizeDialogOpen?: boolean;
  setIsMobileSizeDialogOpen?: (open: boolean) => void;
};

export function AddToCartBtn({
  product,
  handlers,
}: {
  product: common_ProductFull;
  handlers?: Handlers;
}) {
  const internalHandlers = useHandlers({
    id: product.product?.id || 0,
  });

  const merged = handlers
    ? { ...internalHandlers, ...handlers }
    : internalHandlers;

  const {
    activeSizeId,
    openItem,
    isLoading,
    handleSizeSelect,
    handleAddToCart,
    isMobileSizeDialogOpen,
    setIsMobileSizeDialogOpen,
  } = merged as Required<Handlers> & ReturnType<typeof useHandlers>;
  const { preorder, preorderRaw } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });

  return (
    <>
      <MobileSelectSize
        product={product}
        activeSizeId={activeSizeId}
        handleSizeSelect={handleSizeSelect}
        open={isMobileSizeDialogOpen}
        onOpenChange={setIsMobileSizeDialogOpen}
      />
      <div
        className={cn("fixed inset-x-5 bottom-2.5 z-10 grid lg:sticky", {
          "lg:hidden": openItem,
          "bg-bgColor": preorder,
        })}
      >
        {preorder && isDateTodayOrFuture(preorderRaw || "") && (
          <Text className="bg-[#F0F0F0] p-1.5 text-center uppercase leading-none text-textColor">
            {preorder}
          </Text>
        )}
        <LoadingButton
          variant="simpleReverse"
          size="lg"
          onAction={handleAddToCart}
          isLoadingExternal={isLoading}
          className="border border-textColor lg:border-none"
        >
          <Text variant="inherit">
            {preorder && isDateTodayOrFuture(preorderRaw || "")
              ? "preorder"
              : "add"}
          </Text>
          {isSaleApplied ? (
            <Text variant="inactive">
              {priceMinusSale}
              <Text component="span">{priceWithSale}</Text>
            </Text>
          ) : (
            <Text variant="inherit">{price}</Text>
          )}
        </LoadingButton>
      </div>
    </>
  );
}
