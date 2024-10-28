import type { common_Product } from "@/api/proto-http/frontend";

import { ProductItem } from "./product-item";

export default function ProductsGridSection({
  products,
}: {
  products: common_Product[] | undefined;
}) {
  if (!products) return null;

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2 2xl:grid-cols-4">
      {products.map((v) => (
        <div className="col-span-1" key={v.id}>
          <ProductItem className="mx-auto max-w-[280px]" product={v} />
        </div>
      ))}
    </div>
  );
}
