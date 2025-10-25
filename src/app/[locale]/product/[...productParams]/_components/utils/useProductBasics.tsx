import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { getPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: common_ProductFull }) {
  const t = useTranslations("product");
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);

  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;

  const productTranslations =
    product.product?.productDisplay?.productBody?.translations;

  const currentTranslation =
    productTranslations?.find((t) => t.languageId === languageId) ||
    productTranslations?.[0];

  const preorder = getPreorderDate(product, t);
  const isComposition = productBody?.composition;
  const isCare = productBody?.careInstructions;

  const productCategory = getTopCategoryName(
    dictionary?.categories || [],
    productBody?.topCategoryId || 0,
  );

  const productSubCategory = getSubCategoryName(
    dictionary?.categories || [],
    productBody?.subCategoryId || 0,
  );

  const name = `${productBody?.collection || ""} ${productBody?.version || ""} ${productBody?.fit || ""} ${productBody?.color || ""} ${currentTranslation?.name || ""}`;

  return {
    isComposition,
    isCare,
    preorder,
    preorderRaw: productBody?.preorder,
    productId: product.product?.id || 0,
    name,
    description: currentTranslation?.description,
    topCategoryId: productBody?.topCategoryId,
    subCategoryId: productBody?.subCategoryId,
    typeId: productBody?.typeId,
    gender: productBody?.targetGender,
    color: productBody?.color,
    productCategory,
    productSubCategory,
  };
}
