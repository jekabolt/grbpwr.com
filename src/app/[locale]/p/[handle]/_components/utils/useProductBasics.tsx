import { StorefrontColorway } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

export function useProductBasics({ product }: { product: StorefrontColorway }) {
  const { languageId } = useTranslationsStore((state) => state);

  const display = product.display;
  const translations = display?.translations;

  const currentTranslation =
    translations?.find((t) => t.languageId === languageId) || translations?.[0];

  const name = currentTranslation?.name;

  return {
    isComposition: display?.composition,
    isCare: display?.careInstructions,
    // The lean storefront projection (R3) carries no preorder date, model-wears,
    // category ids or sale percentage, so those PDP fields degrade to absent.
    preorder: null as string | null,
    preorderRaw: undefined as string | undefined,
    baseSku: product.baseSku || "",
    name,
    description: currentTranslation?.description,
    topCategoryId: undefined as number | undefined,
    subCategoryId: undefined as number | undefined,
    typeId: undefined as number | undefined,
    gender: display?.targetGender,
    color: product.colorCode,
    productCategory: "",
    productSubCategory: "",
    collection: display?.collectionCode,
  };
}
