import { StorefrontColorway } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { formatSizeName } from "@/lib/utils";

function getModelText(
  height: number | undefined,
  sizeName: string | undefined,
  t: (key: string) => string,
): string {
  return sizeName && height
    ? `${t("model is")} ${height}cm ${t("and wears size")} ${sizeName}`
    : "";
}

export function useModelInfo({ product }: { product: StorefrontColorway }) {
  const t = useTranslations("product");
  const display = product.display;
  // StorefrontColorwayDisplay carries the public size code directly (never a size
  // id); height 0 means unknown.
  const modelHeight = display?.modelWearsHeightCm || undefined;
  const modelSize = display?.modelWearsSizeCode
    ? formatSizeName(display.modelWearsSizeCode)
    : undefined;
  const modelWear = getModelText(modelHeight, modelSize, t);

  return {
    modelWear,
  };
}
