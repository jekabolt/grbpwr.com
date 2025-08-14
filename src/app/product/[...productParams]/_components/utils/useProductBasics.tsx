import { common_ProductFull } from "@/api/proto-http/frontend";

import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: common_ProductFull }) {
  const productBody = product.product?.productDisplay?.productBody;

  const preorder = getPreorderDate(product);

  return {
    preorder,
    preorderRaw: productBody?.preorder,
    productId: product.product?.id || 0,
    name: productBody?.name,
    description: productBody?.description,
    topCategoryId: productBody?.topCategoryId,
    subCategoryId: productBody?.subCategoryId,
    typeId: productBody?.typeId,
    gender: productBody?.targetGender,
    color: productBody?.color,
  };
}
