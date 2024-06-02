import type { common_ProductFull } from "@/api/proto-http/frontend";
import ImageComponent from "../global/Image";

export default function CartItemRow({
  product,
}: {
  product?: common_ProductFull;
}) {
  if (!product) return null;

  const { product: p } = product;

  return (
    <div className="flex justify-between text-textColor">
      <div className="flex w-2/3 gap-6">
        <div className="h-full w-28 flex-none">
          <ImageComponent
            src={p?.productInsert?.thumbnail || ""}
            alt="product"
            fit="cover"
            aspectRatio="2/3"
          />
        </div>
        <div className="space-y-2">
          <p className="text-md">{p?.productInsert?.name}</p>
          <p className="text-sm">{p?.productInsert?.color}</p>
          <p className="text-xs">{"[size]"}</p>
        </div>
      </div>
      <div className="flex w-1/3 flex-col items-end space-y-2">
        <p className="text-md">BTC {p?.productInsert?.price?.value}</p>
        <p className="text-xs line-through">
          BTC {p?.productInsert?.price?.value}
        </p>
      </div>
    </div>
  );
}
