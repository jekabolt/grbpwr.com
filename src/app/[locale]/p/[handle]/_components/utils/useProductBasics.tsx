import { common_ColorwayFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { getPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: common_ColorwayFull }) {
  const t = useTranslations("product");
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);

  const productBody =
    product.colorway?.display?.productBody?.productBodyInsert;

  const productTranslations =
    product.colorway?.display?.productBody?.translations;

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

  const name = currentTranslation?.name;

  return {
    isComposition,
    isCare,
    preorder,
    preorderRaw: productBody?.preorder,
    productId: product.colorway?.id || 0,
    name,
    description: currentTranslation?.description,
    topCategoryId: productBody?.topCategoryId,
    subCategoryId: productBody?.subCategoryId,
    typeId: productBody?.typeId,
    gender: productBody?.targetGender,
    color: productBody?.dictionaryColor?.name ?? productBody?.colorCode,
    productCategory,
    productSubCategory,
    collection: productBody?.collection,
  };
}
