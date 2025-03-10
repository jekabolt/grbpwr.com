import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";

type Props = {
  id: number;
  activeSizeId: number | undefined;
};

export function useDisabled({ id, activeSizeId }: Props) {
  const { dictionary } = useDataContext();
  const { products } = useCart((state) => state);

  const productQuantityInCart =
    products.find((p) => p.id === id && p.size === activeSizeId?.toString())
      ?.quantity || 0;

  const maxOrderItems = dictionary?.maxOrderItems || 3;
  const isMaxQuantity = productQuantityInCart >= maxOrderItems;

  return {
    isMaxQuantity,
  };
}
