import { common_ProductFull } from "@/api/proto-http/frontend";

import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: common_ProductFull }) {
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;

  const preorder = getPreorderDate(product);
  const isComposition = productBody?.composition;
  const isCare = productBody?.careInstructions;
  return {
    isComposition,
    isCare,
    preorder,
    preorderRaw: productBody?.preorder,
    productId: product.product?.id || 0,
    name: product.product?.productDisplay?.productBody?.translations?.[0]?.name,
    description:
      product.product?.productDisplay?.productBody?.translations?.[0]
        ?.description,
    topCategoryId: productBody?.topCategoryId,
    subCategoryId: productBody?.subCategoryId,
    typeId: productBody?.typeId,
    gender: productBody?.targetGender,
    color: productBody?.color,
  };
}
