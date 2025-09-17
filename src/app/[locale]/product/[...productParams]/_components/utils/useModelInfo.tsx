import { common_ProductFull } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/contexts/DataContext";

function getModelText(height?: number | undefined, sizeName?: string): string {
  return sizeName && height
    ? `model is ${height}cm and wears size ${sizeName}`
    : "";
}

export function useModelInfo({ product }: { product: common_ProductFull }) {
  const { dictionary } = useDataContext();
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;
  const modelSizeId = productBody?.modelWearsSizeId;
  const modelSize = dictionary?.sizes?.find((s) => s.id === modelSizeId)?.name;
  const modelHeight = productBody?.modelWearsHeightCm;
  const modelWear = getModelText(modelHeight, modelSize);

  return {
    modelWear,
  };
}
