import { common_ProductFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { Measurements } from "@/app/product/[...productParams]/_components/measurements";

import { Button } from "../../../../components/ui/button";
import { Text } from "../../../../components/ui/text";
import { LoadingButton } from "./loading-button";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductPricing } from "./utils/useProductPricing";

export function MobileMeasurements({
  product,
  selectedSize,
  outOfStock,
  isOneSize,
  handleAddToCart,
  handleSelectSize,
}: MobileMeasurementsProps) {
  const { preorder } = useProductBasics({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild className="text-left">
        <Button variant="underline" className="uppercase">
          size guide
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-0 z-40 flex h-full flex-col gap-4 overflow-y-auto bg-bgColor p-2.5">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex items-center justify-between">
            <Text variant="uppercase">size guide</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="mb-10">
            <Measurements
              product={product}
              selectedSize={selectedSize}
              outOfStock={outOfStock}
              isOneSize={isOneSize}
              handleSelectSize={handleSelectSize}
            />
          </div>
          <div className="fixed bottom-2.5 left-2.5 right-2.5">
            <LoadingButton
              variant="simpleReverse"
              size="lg"
              onAction={() => handleAddToCart()}
            >
              <Text variant="inherit">{preorder ? "preorder" : "add"}</Text>
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
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

export type MobileMeasurementsProps = {
  product: common_ProductFull;
  selectedSize: number;
  outOfStock?: Record<number, boolean>;
  isOneSize?: boolean;
  handleAddToCart: () => Promise<boolean>;
  handleSelectSize: (size: number) => void;
};
