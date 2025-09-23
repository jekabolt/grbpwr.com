import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useDataContext } from "@/components/contexts/DataContext";

function getModelText(
  height?: number | undefined,
  sizeName?: string,
  t?: (key: string) => string,
): string {
  return sizeName && height && t
    ? `${t("model is")} ${height}cm ${t("and wears size")} ${sizeName}`
    : "";
}

export function useModelInfo({ product }: { product: common_ProductFull }) {
  const t = useTranslations("product");
  const { dictionary } = useDataContext();
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;
  const modelSizeId = productBody?.modelWearsSizeId;
  const modelSize = dictionary?.sizes?.find((s) => s.id === modelSizeId)?.name;
  const modelHeight = productBody?.modelWearsHeightCm;
  const modelWear = getModelText(modelHeight, modelSize, t);

  return {
    modelWear,
  };
}
