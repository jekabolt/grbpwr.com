import { common_ProductFull } from "@/api/proto-http/frontend";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";

export type MeasurementType = "clothing" | "ring" | "shoe";

export function useMeasurementType({
  product,
}: {
  product: common_ProductFull;
}) {
  const { dictionary } = useDataContext();
  const { selectedLanguage } = useCurrency((state) => state);
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;
  const categoryId = productBody?.topCategoryId;
  const subCategoryId = productBody?.subCategoryId;
  const typeId = productBody?.typeId;

  const category = dictionary?.categories?.find((c) => c.id === categoryId)
    ?.translations?.[selectedLanguage.id]?.name;

  const getMeasurementType = (): MeasurementType => {
    const type = dictionary?.categories
      ?.find((c) => c.id === typeId)
      ?.translations?.[selectedLanguage.id]?.name?.toLowerCase();
    if (type === "rings") return "ring";
    if (category?.toLowerCase() === "shoes") return "shoe";

    return "clothing";
  };

  const measurementType = getMeasurementType();
  return {
    measurementType,
    subCategoryId,
    typeId,
    categoryId,
  };
}
