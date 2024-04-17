import { common_Product } from "@/api/proto-http/frontend";
import Link from "next/link";
import Image from "@/components/elements/Image";
import { cn } from "@/lib/utils";

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
        <span className="grow text-xs font-medium text-[#311EEE] underline">
          {product.productInsert?.name}
        </span>
        <span className="block w-24 text-right text-sm font-medium">
          {currencyMap.eth} {product.productInsert?.price?.value}
        </span>
      </div>
    </div>
  );
}
