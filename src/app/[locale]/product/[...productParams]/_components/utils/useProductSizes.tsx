import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

import { useProductBasics } from "./useProductBasics";

export function useProductSizes({ product }: { product: common_ProductFull }) {
  const { dictionary } = useDataContext();
  const { productId } = useProductBasics({ product });
  const cartProducts = useCart((state) => state.products);

  const sizes = product.sizes;
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  // Base stock from backend
  const rawSizeQuantity: Record<number, number> =
    product.sizes?.reduce(
      (acc, size) => {
        acc[size.sizeId as number] = Number(size.quantity?.value || "0");
        return acc;
      },
      {} as Record<number, number>,
    ) || {};

  // Subtract what this user already has in cart for this product/size
  const sizeQuantity: Record<number, number> = Object.fromEntries(
    Object.entries(rawSizeQuantity).map(([sizeIdStr, baseQty]) => {
      const sizeId = Number(sizeIdStr);
      const inCartCount = cartProducts.filter(
        (p) => p.id === productId && Number(p.size) === sizeId,
      ).length;

      const adjusted = Math.max(0, (baseQty as number) - inCartCount);
      return [sizeId, adjusted];
    }),
  );

  const isOneSize =
    sizeNames?.length === 1 && sizeNames[0].name.toLowerCase() === "os";

  return {
    sizes,
    sizeNames,
    isOneSize,
    sizeQuantity,
  };
}
