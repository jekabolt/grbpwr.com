import Image from "next/image";
import Link from "next/link";

export default function ProductsSectionItem({ product }: { product?: any }) {
  if (!product) return null;

  return (
    <div>
      <Link
        className="absolute z-10 h-full w-full hover:border hover:border-pink-400"
        href={`/catalog/${product.slug}`}
      ></Link>

      <div className="relative h-[400px]">
        <Image
          src={product?.productInsert?.thumbnail || ""}
          alt="product thumbnail"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex w-full justify-between gap-3">
        <span className="grow font-bold text-blue-600 underline">
          {product.productInsert.name}
        </span>
        <span className="block w-24 text-right">
          ETH: {product.productInsert.price.value}
        </span>
      </div>
    </div>
  );
}
