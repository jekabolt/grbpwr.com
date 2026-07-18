import { StorefrontColorway } from "@/api/proto-http/frontend";

import { useProductSizes } from "./useProductSizes";

const LOW_STOCK = 5;

const lowStockTextMap: Record<number, string> = {
  1: "(only one left)",
  2: "(only two left)",
  3: "(only three left)",
  4: "(only four left)",
  5: "(only five left)",
};

function getSizeText(isShoes: boolean | undefined, sizeName: string) {
  const formattedSizeName = isShoes ? `${sizeName} (eu)` : sizeName;
  return formattedSizeName;
}

function getNoSizeText(isShoes: boolean | undefined): string {
  return isShoes ? "select size (eu)" : "select size";
}

export function useActiveSizeInfo({
  product,
  activeSizeId,
}: {
  product: StorefrontColorway;
  activeSizeId: number | undefined;
}) {
  const { sizeNames, sizeQuantity } = useProductSizes({ product });

  const activeSizeName = activeSizeId
    ? sizeNames?.find((size) => size.id === activeSizeId)?.name
    : "";

  const activeSizeQuantity = activeSizeId ? sizeQuantity[activeSizeId] : 0;
  const lowStockText =
    activeSizeId && activeSizeQuantity <= LOW_STOCK && activeSizeQuantity > 0
      ? lowStockTextMap[activeSizeQuantity]
      : "";

  // Category ids are gone (R3); derive the shoe suffix from the public size system.
  const isShoes =
    product.variants?.[0]?.size?.system === "SIZE_SKU_SYSTEM_SHOE";

  const triggerText = activeSizeName
    ? getSizeText(isShoes, activeSizeName)
    : getNoSizeText(isShoes);

  return {
    sizeNames,
    lowStockText,
    triggerText,
  };
}
