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

export function getUrlKey(urlKey: string | undefined, map: MapType): string {
  if (!urlKey) return '';
  return Object.entries(map).find(([_, value]) => value === urlKey)?.[0] || '';
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
  }: {
    sort?: string | null;
    order?: string | null;
    topCategoryIds?: string | null;
    subCategoryIds?: string | null;
    gender?: string | null;
    size?: string | null;
    sale?: string | null;
    tag?: string | null;
  },
  dictionary?: common_Dictionary
): Pick<
  GetProductsPagedRequest,
  "sortFactors" | "orderFactor" | "filterConditions"
> {
  const sortFactor = getEnumFromUrl(sort, SORT_MAP_URL) as common_SortFactor | undefined;
  const orderFactor = getEnumFromUrl(order, ORDER_MAP) as common_OrderFactor | undefined;
  const genderEnums = getEnumFromUrl(gender, GENDER_MAP) as common_GenderEnum | undefined;
  const sizeId = dictionary?.sizes?.find(s => s.name?.toLowerCase() === size?.toLowerCase())?.id;

  return {
    sortFactors: sortFactor ? [sortFactor] : undefined,
    orderFactor: orderFactor,
    filterConditions: {
      topCategoryIds: topCategoryIds ? [parseInt(topCategoryIds)] : undefined,
      subCategoryIds: subCategoryIds ? [parseInt(subCategoryIds)] : undefined,
      typeIds: undefined,
      sizesIds: sizeId ? [sizeId] : undefined,
      from: undefined,
      to: undefined,
      onSale: sale ? sale === "true" : undefined,
      color: undefined,
      preorder: undefined,
      byTag: tag ? tag : undefined,
      gender: genderEnums ? [genderEnums] : undefined,
    },
  };
}