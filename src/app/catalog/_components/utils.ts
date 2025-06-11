import {
  common_GenderEnum,
  common_OrderFactor,
  common_SortFactor,
  GetProductsPagedRequest
} from "@/api/proto-http/frontend";
import { GENDER_MAP } from "@/constants";

function mapGenderToEnum(gender: string): common_GenderEnum | null {
  // If it's already an enum value, return it
  if (gender.startsWith('GENDER_ENUM_')) {
    return gender as common_GenderEnum;
  }

  // Otherwise, map from human-readable value (men/women/unisex)
  return GENDER_MAP[gender.toLowerCase()] || null;
}

export function getProductsPagedQueryParams({
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
}): Pick<
  GetProductsPagedRequest,
  "sortFactors" | "orderFactor" | "filterConditions"
> {

  const genderEnum = gender ? mapGenderToEnum(gender) : null;
  const genderEnums = genderEnum ? [
    genderEnum,
    ...(genderEnum === 'GENDER_ENUM_MALE' || genderEnum === 'GENDER_ENUM_FEMALE' ? ['GENDER_ENUM_UNISEX' as common_GenderEnum] : [])
  ] : undefined;

  // todo: validate params before make a request
  return {
    sortFactors: sort ? [sort as common_SortFactor] : undefined,
    orderFactor: order ? (order as common_OrderFactor) : undefined,
    filterConditions: {
      topCategoryIds: topCategoryIds ? [parseInt(topCategoryIds)] : undefined,
      subCategoryIds: subCategoryIds ? [parseInt(subCategoryIds)] : undefined,
      typeIds: undefined,
      sizesIds: size ? [parseInt(size)] : undefined,
      from: undefined,
      to: undefined,
      onSale: sale ? sale === "true" : undefined,
      color: undefined,
      preorder: undefined,
      byTag: tag ? tag : undefined,
      gender: genderEnums,
    },
  };
}