import Link from "next/link";
import type { common_Product } from "@/api/proto-http/frontend";
import { CURRENCY_MAP } from "@/constants";

import { cn } from "@/lib/utils";
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
    <div className={cn("relative h-full", className)}>
      <Button asChild className="h-full ">
        <Link
          href={product?.slug || ""}
          className={cn("flex h-full w-full flex-col", className)}
        >
          <div className="relative h-full">
            <Image
              src={
                product.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl ||
                ""
              }
              alt={product.productDisplay?.productBody?.name || ""}
              aspectRatio="4/3"
              fit="cover"
            />
          </div>
          <div className="flex w-full flex-col gap-2 pt-2 text-sm">
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
                {`${CURRENCY_MAP.eth} ${product.productDisplay?.productBody?.price?.value}`}
              </Text>
              {isSaleApplied && (
                <Text>{`${CURRENCY_MAP.eth} ${priceWithSale}`}</Text>
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
