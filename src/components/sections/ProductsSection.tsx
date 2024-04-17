import { common_Product } from "@/api/proto-http/frontend";
import { shouldInsertEmpty } from "@/lib/utils";
import ProductGridItem from "../ProductGridItem";

export default function ProductsSection({
  products,
}: {
  products: common_Product[] | undefined;
}) {
  const gridItems = [];
  let insertedEmptyCount = 0;

  if (!products) return null;
  for (let i = 0; i < products.length; i++) {
    if (shouldInsertEmpty(i + insertedEmptyCount)) {
      insertedEmptyCount++;
      gridItems.push(<div key={`empty-${i}`} className="col-span-1"></div>);
    }
    gridItems.push(
      <div key={i} className="relative col-span-1">
        <ProductGridItem product={products[i]} />
      </div>,
    );
  }

  return <div className="grid grid-cols-4 gap-5">{gridItems}</div>;
}
