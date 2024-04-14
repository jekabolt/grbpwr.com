import Image from "next/image";
import Link from "next/link";

export default function ProductsSection({ products }: { products?: any[] }) {
  if (!products) return null;

  return (
    <div className="grid grid-cols-4 gap-5">
      {products.map((product, i) => (
        <div key={i} className="relative col-span-1">
          <Link
            className="absolute z-10 h-full w-full hover:border hover:border-pink-400"
            href={`/catalog/${product.id}`}
          ></Link>

          <div className="relative h-[400px]">
            <Image
              src={product?.productInsert?.thumbnail || ""}
              alt="ad hero image"
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
      ))}
    </div>
  );
}
