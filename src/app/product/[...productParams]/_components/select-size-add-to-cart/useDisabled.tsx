import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";

type Props = {
  id: number;
  product?: common_ProductFull;
  activeSizeId: number | undefined;
};

export function useDisabled({ id, activeSizeId, product }: Props) {
  const { dictionary } = useDataContext();
  const { products } = useCart((state) => state);

  const productQuantityInCart =
    products.find(
      (p) => p && p.id === id && p.size === activeSizeId?.toString(),
    )?.quantity || 0;

  const maxOrderItems = dictionary?.maxOrderItems || 3;
  const isMaxQuantity = productQuantityInCart >= maxOrderItems;

  const outOfStock =
    product?.sizes?.reduce(
      (acc, size) => {
        acc[size.sizeId || 0] = size.quantity?.value === "0";
        return acc;
      },
      {} as Record<number, boolean>,
    ) || {};

  return {
    isMaxQuantity,
    outOfStock,
  };
}
