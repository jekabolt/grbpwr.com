import {
  common_Dictionary,
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor,
  GetProductsPagedRequest
} from "@/api/proto-http/frontend";
import { GENDER_MAP, ORDER_MAP, SORT_MAP_URL } from "@/constants";

type EnumType = common_SortFactor | common_OrderFactor | common_GenderEnum;
type MapType = typeof SORT_MAP_URL | typeof ORDER_MAP | typeof GENDER_MAP;

export function getUrlKey(enumValue: EnumType, map: MapType): string {
  return Object.keys(map).find(key => map[key] === enumValue) || "";
}

function decodeParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

const VALID_GENDERS = Object.keys(GENDER_MAP);

export function parseRouteParams(params: string[] = []): {
  gender: string | undefined;
  categoryName: string;
  subCategoryName: string;
} {
  const [firstParam, secondParam, thirdParam] = params.map(param =>
    param ? decodeParam(param) : param
  );

  if (firstParam === "objects") {
    return {
      gender: undefined,
      categoryName: "objects",
      subCategoryName: secondParam || "",
    };
  }

  // Check if firstParam is a valid gender
  const isGender = firstParam && VALID_GENDERS.includes(firstParam.toLowerCase());

  if (!isGender && firstParam) {
    return {
      gender: undefined,
      categoryName: firstParam,
      subCategoryName: secondParam || "",
    };
  }

  return {
    gender: firstParam,
    categoryName: secondParam || "",
    subCategoryName: thirdParam || "",
  };
}

export function getEnumFromUrl(urlKey: string | null | undefined, map: MapType): EnumType | undefined {
  if (!urlKey) return undefined;
  return map[urlKey.toLowerCase()];
}

function parsePositiveIntArray(value: string | null | undefined): number[] | undefined {
  if (value == null || value === "") return undefined;
  const ids = value.split(",").map((s) => parseInt(s.trim(), 10));
  const valid = ids.filter((id) => Number.isFinite(id) && id > 0);
  return valid.length > 0 ? valid : undefined;
}

const MAX_TAG_LENGTH = 100;
const MAX_COLLECTION_LENGTH = 50;

export function getProductsPagedQueryParams(
  {
    sort,
    order,
    topCategoryIds,
    subCategoryIds,
    gender,
    size,
    sale,
    tag,
    collection,
    currency,
  }: {
    sort?: string | null;
    order?: string | null;
    topCategoryIds?: string | null;
    subCategoryIds?: string | null;
    gender?: string | null;
    size?: string | null;
    sale?: string | null;
    tag?: string | null;
    collection?: string | null;
    currency?: string | null;
  },
  dictionary?: common_Dictionary
): Pick<
  GetProductsPagedRequest,
  "sortFactors" | "orderFactor" | "filterConditions"
> {
  const sortFactor = getEnumFromUrl(sort, SORT_MAP_URL) as common_SortFactor | undefined;
  const orderFactor = getEnumFromUrl(order, ORDER_MAP) as common_OrderFactor | undefined;
  const primaryGender = getEnumFromUrl(gender, GENDER_MAP) as common_GenderEnum | undefined;
  const unisexEnum = GENDER_MAP.unisex as common_GenderEnum;
  const genderEnums: common_GenderEnum[] | undefined = primaryGender
    ? primaryGender === unisexEnum
      ? [primaryGender]
      : [primaryGender, unisexEnum]
    : undefined;

  const sizeIds = size
    ? size
      .split(",")
      .map(s => dictionary?.sizes?.find(sz => sz.name?.toLowerCase() === s.toLowerCase())?.id)
      .filter((id): id is number => id !== undefined)
    : undefined;

  const collections = collection
    ? collection
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0 && c.length <= MAX_COLLECTION_LENGTH)
    : undefined;

  const validatedTopCategoryIds = parsePositiveIntArray(topCategoryIds ?? "");
  const validatedSubCategoryIds = parsePositiveIntArray(subCategoryIds ?? "");

  const validatedTag =
    tag && tag.length > 0 && tag.length <= MAX_TAG_LENGTH ? tag : undefined;

  return {
    sortFactors: sortFactor ? [sortFactor] : undefined,
    orderFactor: orderFactor,
    filterConditions: {
      topCategoryIds: validatedTopCategoryIds,
      subCategoryIds: validatedSubCategoryIds,
      typeIds: undefined,
      sizesIds: sizeIds && sizeIds.length > 0 ? sizeIds : undefined,
      from: undefined,
      to: undefined,
      onSale: sale ? sale === "true" : undefined,
      color: undefined,
      preorder: undefined,
      byTag: validatedTag,
      gender: genderEnums,
      collections: collections && collections.length > 0 ? collections : undefined,
      currency: currency?.toUpperCase() || undefined,
    },
  };
}