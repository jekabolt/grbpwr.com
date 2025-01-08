import type { common_Product } from "@/api/proto-http/frontend";

import { ProductItem } from "./product-item";

export default function ProductsGridSection({
  products,
}: {
  products: common_Product[] | undefined;
}) {
  if (!products) return null;

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-x-4 lg:gap-y-16 2xl:grid-cols-4">
      {products.map((v) => (
        <div className="col-span-1 h-80 lg:h-[555px]" key={v.id}>
          <ProductItem className="mx-auto flex h-full flex-col" product={v} />
        </div>
      ))}
    </div>
  );
}
