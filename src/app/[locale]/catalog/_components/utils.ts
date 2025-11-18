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
  },
  dictionary?: common_Dictionary
): Pick<
  GetProductsPagedRequest,
  "sortFactors" | "orderFactor" | "filterConditions"
> {
  const sortFactor = getEnumFromUrl(sort, SORT_MAP_URL) as common_SortFactor | undefined;
  const orderFactor = getEnumFromUrl(order, ORDER_MAP) as common_OrderFactor | undefined;
  const genderEnums = getEnumFromUrl(gender, GENDER_MAP) as common_GenderEnum | undefined;

  const sizeIds = size
    ? size
      .split(",")
      .map(s => dictionary?.sizes?.find(sz => sz.name?.toLowerCase() === s.toLowerCase())?.id)
      .filter((id): id is number => id !== undefined)
    : undefined;

  const collections = collection
    ? collection.split(",").map(c => c.trim()).filter(Boolean)
    : undefined;

  // todo: validate params before make a request
  return {
    sortFactors: sortFactor ? [sortFactor] : undefined,
    orderFactor: orderFactor,
    filterConditions: {
      topCategoryIds: topCategoryIds ? [parseInt(topCategoryIds)] : undefined,
      subCategoryIds: subCategoryIds ? [parseInt(subCategoryIds)] : undefined,
      typeIds: undefined,
      sizesIds: sizeIds && sizeIds.length > 0 ? sizeIds : undefined,
      from: undefined,
      to: undefined,
      onSale: sale ? sale === "true" : undefined,
      color: undefined,
      preorder: undefined,
      byTag: tag ? tag : undefined,
      gender: genderEnums ? [genderEnums] : undefined,
      collections: collections && collections.length > 0 ? collections : undefined,
      currency: undefined,
    },
  };
}