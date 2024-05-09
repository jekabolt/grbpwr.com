import type { common_Product } from "@/api/proto-http/frontend";
import Image from "@/components/global/Image";
import { cn } from "@/lib/utils";
import Link from "next/link";

// todo: match with api
const currencyMap = {
  eth: "eth",
};

export default function ProductItem({
  product,
  className,
}: {
  product: common_Product;
  className: string;
}) {
  const isSaleApplied = product.productInsert?.salePercentage?.value !== "0";

  const priceWithSale =
    (parseFloat(product.productInsert?.price?.value || "0") *
      (100 - parseInt(product.productInsert?.salePercentage?.value || "0"))) /
    100;

  return (
    <div className={cn("relative", className)}>
      <Link
        className="absolute z-10 h-full w-full"
        href={`/catalog/${product.slug}`}
      ></Link>

      <div className="relative h-80">
        <Image
          src={product.productInsert?.thumbnail || ""}
          alt={product.productInsert?.name || ""}
          aspectRatio="4/3"
        />
      </div>
      <div className="flex w-full gap-3">
        {/* todo: change to css variable */}
        <div className="flex grow flex-col text-xs font-medium text-highlightTextColor underline">
          <span>{product.productInsert?.brand}</span>
          <span>{product.productInsert?.name}</span>
        </div>
        <div className="flex w-24 flex-col text-right text-sm font-medium text-textColor">
          {product.productInsert?.preorder && (
            <span className="opacity-50">preorder</span>
          )}
          <span className={isSaleApplied ? "line-through opacity-50" : ""}>
            {currencyMap.eth} {product.productInsert?.price?.value}
          </span>
          {isSaleApplied && (
            <span className="text">
              {currencyMap.eth} {priceWithSale}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
