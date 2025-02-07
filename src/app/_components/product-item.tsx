import Link from "next/link";
import type { common_Product } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

const emptyPreorder = "0001-01-01T00:00:00Z";

export function ProductItem({
  product,
  className,
}: {
  product: common_Product;
  className: string;
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
          className={cn("flex h-full w-full flex-col", className)}
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
          <div className="flex w-full flex-col gap-2 pt-2">
            <Text
              variant="undrleineWithColors"
              className="overflow-hidden text-ellipsis leading-none"
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
              {preorder !== emptyPreorder && (
                <Text variant="inactive">preorder</Text>
              )}
            </div>
          </div>
        </Link>
      </Button>
    </div>
  );
}
