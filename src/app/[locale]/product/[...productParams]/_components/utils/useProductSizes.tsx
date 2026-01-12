import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { formatSizeName } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";

import { useProductBasics } from "./useProductBasics";

export function useProductSizes({ product }: { product: common_ProductFull }) {
  const { dictionary } = useDataContext();
  const { productId } = useProductBasics({ product });
  const cartProducts = useCart((state) => state.products);

  const sizes = product.sizes;
  const sizeNames = sizes?.map((s) => {
    const dictSize = dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId);
    const rawName = (dictSize?.name || "").trim();
    const formattedName = formatSizeName(rawName);

    return {
      id: s.sizeId as number,
      name: formattedName,
    };
  });

  const sizeQuantity: Record<number, number> =
    product.sizes?.reduce(
      (acc, size) => {
        const sizeId = size.sizeId as number;
        const backendQty = Number(size.quantity?.value || "0");
        const inCartCount = cartProducts.filter(
          (p) => p.id === productId && Number(p.size) === sizeId,
        ).length;

        acc[sizeId] = Math.max(0, backendQty - inCartCount);
        return acc;
      },
      {} as Record<number, number>,
    ) || {};

  const isOneSize =
    sizeNames?.length === 1 && sizeNames[0].name.toLowerCase() === "os";

  return {
    sizes,
    sizeNames,
    isOneSize,
    sizeQuantity,
  };
}
