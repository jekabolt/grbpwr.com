import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

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
  product: common_ProductFull;
  activeSizeId: number | undefined;
}) {
  const { dictionary } = useDataContext();
  const { selectedLanguage } = useCurrency((state) => state);
  const { sizeNames, sizeQuantity } = useProductSizes({ product });

  const activeSizeName = activeSizeId
    ? sizeNames?.find((size) => size.id === activeSizeId)?.name
    : "";

  const activeSizeQuantity = activeSizeId ? sizeQuantity[activeSizeId] : 0;
  const lowStockText =
    activeSizeId && activeSizeQuantity <= LOW_STOCK && activeSizeQuantity > 0
      ? lowStockTextMap[activeSizeQuantity]
      : "";

  const categoryId = dictionary?.categories?.find((c) =>
    sizeNames?.some((s) => s.id === activeSizeId),
  )?.id;
  const category = dictionary?.categories?.find((c) => c.id === categoryId)
    ?.translations?.[selectedLanguage.id]?.name;
  const isShoes = category?.toLowerCase().includes("shoes");

  const triggerText = activeSizeName
    ? getSizeText(isShoes, activeSizeName)
    : getNoSizeText(isShoes);

  return {
    sizeNames,
    lowStockText,
    triggerText,
  };
}
