import Link from "next/link";
import type { common_Product } from "@/api/proto-http/frontend";
import { currencySymbols, EMPTY_PREORDER } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio, cn, isDateTodayOrFuture } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function ProductItem({
  product,
  className,
  isInfoVisible = true,
}: {
  product: common_Product;
  className: string;
  isInfoVisible?: boolean;
}) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const isSaleApplied =
    product.productDisplay?.productBody?.salePercentage?.value !== "0";

  const priceWithSale =
    (parseFloat(product.productDisplay?.productBody?.price?.value || "0") *
      (100 -
        parseInt(
          product.productDisplay?.productBody?.salePercentage?.value || "0",
        ))) /
    100;

  const preorder = product.productDisplay?.productBody?.preorder;

  return (
    <div className={cn("relative", className)}>
      <Button asChild>
        <Link
          href={product?.slug || ""}
          className={cn("group flex h-full w-full flex-col", className)}
        >
          <div className="relative">
            <Image
              src={
                product.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl ||
                ""
              }
              alt={product.productDisplay?.productBody?.name || ""}
              aspectRatio={calculateAspectRatio(
                product.productDisplay?.thumbnail?.media?.thumbnail?.width,
                product.productDisplay?.thumbnail?.media?.thumbnail?.height,
              )}
              fit="contain"
            />
          </div>
          <div
            className={cn("flex w-full flex-col gap-2 pt-2", {
              hidden: !isInfoVisible,
            })}
          >
            <Text
              variant="undrleineWithColors"
              className="overflow-hidden text-ellipsis leading-none group-[:visited]:text-visitedLinkColor"
            >
              {product.productDisplay?.productBody?.name}
            </Text>
            <div className="flex gap-1 leading-none">
              <Text
                variant={isSaleApplied ? "strileTroughInactive" : "default"}
              >
                {`${currencySymbols[selectedCurrency]} ${convertPrice(product.productDisplay?.productBody?.price?.value || "")}`}
              </Text>
              {isSaleApplied && (
                <Text>{`${currencySymbols[selectedCurrency]} ${convertPrice(priceWithSale.toString())}`}</Text>
              )}
              {preorder !== EMPTY_PREORDER &&
                isDateTodayOrFuture(preorder || "") && (
                  <Text variant="inactive">preorder</Text>
                )}
            </div>
          </div>
        </Link>
      </Button>
    </div>
  );
}
