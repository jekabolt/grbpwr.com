import { StorefrontColorway } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { baseSkuOf } from "@/lib/slug-tail";
import { useDataContext } from "@/components/contexts/DataContext";

type Props = {
  product?: StorefrontColorway;
  activeSizeId: number | undefined;
};

export function useDisabled({ product }: Props) {
  const { dictionary } = useDataContext();
  const { products } = useCart((state) => state);

  const maxOrderItems = dictionary?.maxOrderItems || 3;
  const baseSku = product?.baseSku || "";
  const existingItemCount = products.filter(
    (p) => baseSkuOf(p.variantSku) === baseSku,
  ).length;
  const isMaxQuantity = existingItemCount >= maxOrderItems;

  const outOfStock =
    product?.variants?.reduce(
      (acc, v) => {
        acc[v.size?.skuOrd ?? 0] = v.soldOut === true;
        return acc;
      },
      {} as Record<number, boolean>,
    ) || {};

  return {
    isMaxQuantity,
    outOfStock,
  };
}
