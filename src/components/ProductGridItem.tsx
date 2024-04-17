import { common_Product } from "@/api/proto-http/frontend";
import Image from "next/image";
import Link from "next/link";

export default function ProductGridItem({
  product,
}: {
  product: common_Product;
}) {
  return (
    <div>
      <Link
        className="absolute z-10 h-full w-full hover:border hover:border-pink-400"
        href={`/catalog/${product.slug}`}
      ></Link>

      <div className="relative h-[400px]">
        <Image
          src={product.productInsert?.thumbnail || ""}
          alt={product.productInsert?.name || ""}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex w-full justify-between gap-3">
        <span className="grow text-xs font-bold text-blue-600 underline">
          {product.productInsert?.name}
        </span>
        <span className="block w-24 text-right text-xs">
          ETH: {product.productInsert?.price?.value}
        </span>
      </div>
    </div>
  );
}
