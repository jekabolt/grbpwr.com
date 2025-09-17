import { common_ProductFull } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { getPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: common_ProductFull }) {
  const { languageId } = useTranslationsStore((state) => state);
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;

  const productTranslations =
    product.product?.productDisplay?.productBody?.translations;

  const currentTranslation =
    productTranslations?.find((t) => t.languageId === languageId) ||
    productTranslations?.[0];

  const preorder = getPreorderDate(product);
  const isComposition = productBody?.composition;
  const isCare = productBody?.careInstructions;
  return {
    isComposition,
    isCare,
    preorder,
    preorderRaw: productBody?.preorder,
    productId: product.product?.id || 0,
    name: currentTranslation?.name,
    description: currentTranslation?.description,
    topCategoryId: productBody?.topCategoryId,
    subCategoryId: productBody?.subCategoryId,
    typeId: productBody?.typeId,
    gender: productBody?.targetGender,
    color: productBody?.color,
  };
}
