import type { common_Product } from "@/api/proto-http/frontend";
// import { shouldInsertEmpty } from "@/lib/utils";
import ProductItem from "@/components/elements/ProductItem";

export default function ProductsGridSection({
  products,
}: {
  products: common_Product[] | undefined;
}) {
  // const gridItems = [];
  // let insertedEmptyCount = 0;

  if (!products) return null;

  // for (let i = 0; i < products.length; i++) {
  //   if (shouldInsertEmpty(i + insertedEmptyCount)) {
  //     insertedEmptyCount++;
  //     gridItems.push(<div key={`empty-${i}`} className="col-span-1"></div>);
  //   }
  //   gridItems.push(
  //     <div key={i} className="relative col-span-1">
  //       <ProductGridItem product={products[i]} />
  //     </div>,
  //   );
  // }

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
