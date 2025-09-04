import { common_ProductFull } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/contexts/DataContext";

export function useProductSizes({ product }: { product: common_ProductFull }) {
  const { dictionary } = useDataContext();
  const sizes = product.sizes;
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));
  const sizeQuantity =
    product.sizes?.reduce(
      (acc, size) => {
        acc[size.sizeId as number] = Number(size.quantity?.value || "0");
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
