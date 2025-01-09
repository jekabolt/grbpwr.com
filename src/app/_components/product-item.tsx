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

  return (
    <div className={cn("relative", className)}>
      <Button asChild>
        <Link href={product?.slug || ""}>
          <div className={cn("relative h-80", className)}>
            <Image
              src={
                product.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl ||
                ""
              }
              alt={product.productDisplay?.productBody?.name || ""}
              aspectRatio="4/3" // take from BE values
              fit="cover"
              // blurHash={product.productDisplay?.thumbnail?.media?.blurhash}
            />
          </div>
          <div className="flex w-full flex-col gap-2 text-sm">
            {/* todo: change to css variable */}
            <Text variant="undrleineWithColors" className="leading-none">
              {`${product.productDisplay?.productBody?.brand} ${product.productDisplay?.productBody?.name}`}
            </Text>
            <div className="flex gap-1">
              <Text
                variant={isSaleApplied ? "strileTroughInactive" : "default"}
              >
                {`${CURRENCY_MAP.eth} ${product.productDisplay?.productBody?.price?.value}`}
              </Text>
              {isSaleApplied && (
                <Text>{`${CURRENCY_MAP.eth} ${priceWithSale}`}</Text>
              )}
              {product.productDisplay?.productBody?.preorder &&
                product.productDisplay?.productBody?.preorder !==
                  emptyPreorder && <Text variant="inactive">preorder</Text>}
            </div>
          </div>
        </Link>
      </Button>
    </div>
  );
}
