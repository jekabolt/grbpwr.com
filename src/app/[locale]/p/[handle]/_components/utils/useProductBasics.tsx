import { StorefrontColorway } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { formatPreorderDate } from "@/app/[locale]/(checkout)/cart/_components/utils";

export function useProductBasics({ product }: { product: StorefrontColorway }) {
  const t = useTranslations("product");
  const { languageId } = useTranslationsStore((state) => state);

  const display = product.display;
  const translations = display?.translations;

  const currentTranslation =
    translations?.find((t) => t.languageId === languageId) || translations?.[0];

  const name = currentTranslation?.name;

  // category_labels is the resolved [top, sub, type] name list (locale-neutral).
  const [topCategory, subCategory] = display?.categoryLabels || [];

  return {
    isComposition: display?.composition,
    isCare: display?.careInstructions,
    preorder: formatPreorderDate(display?.preorder, t),
    preorderRaw: display?.preorder,
    baseSku: product.baseSku || "",
    name,
    description: currentTranslation?.description,
    gender: display?.targetGender,
    color: product.colorCode,
    productCategory: topCategory || "",
    productSubCategory: subCategory || "",
    collection: display?.collectionCode,
  };
}
