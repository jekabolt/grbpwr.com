import { StorefrontColorway } from "@/api/proto-http/frontend";

import { useViewerTier } from "@/lib/hooks/use-viewer-tier";
import { baseSkuOf } from "@/lib/slug-tail";
import { useCart } from "@/lib/stores/cart/store-provider";
import { isProductLocked } from "@/lib/tier";
import { useDataContext } from "@/components/contexts/DataContext";

type Props = {
  product?: StorefrontColorway;
  activeSizeId: number | undefined;
};

export function useDisabled({ product }: Props) {
  const { dictionary } = useDataContext();
  const { products } = useCart((state) => state);
  const { accountTier, isSignedIn } = useViewerTier();

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

  // Locked teaser: the viewer can't buy this tier-gated piece (purchase is also
  // blocked server-side). The PDP add-to-cart becomes an adaptive sign-in /
  // members-only CTA instead. `isSignedIn` picks the wording and the route.
  const locked = product ? isProductLocked(product, accountTier) : false;

  return {
    isMaxQuantity,
    outOfStock,
    locked,
    isSignedIn,
  };
}
