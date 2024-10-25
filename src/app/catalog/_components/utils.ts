import {
  common_OrderFactor,
  common_SortFactor,
  GetProductsPagedRequest,
} from "@/api/proto-http/frontend";

export function getProductsPagedQueryParams({
  sort,
  order,
  category,
  gender,
  size,
}: {
  sort?: string | null;
  order?: string | null;
  category?: string | null;
  gender?: string | null;
  size?: string | null;
}): Pick<
  GetProductsPagedRequest,
  "sortFactors" | "orderFactor" | "filterConditions"
> {
  // todo: validate params before make a request
  // todo: add gender

  return {
    sortFactors: sort ? [sort as common_SortFactor] : undefined,
    orderFactor: order ? (order as common_OrderFactor) : undefined,
    filterConditions: {
      categoryIds: category ? [parseInt(category)] : undefined,
      //   genderIds: gender ? [parseInt(gender)] : undefined,
      sizesIds: size ? [parseInt(size)] : undefined,
      from: undefined,
      to: undefined,
      onSale: undefined,
      color: undefined,
      preorder: undefined,
      byTag: undefined,
      gender: undefined,
    },
  };
}
