import type {
  common_Colorway,
  StorefrontColorway,
} from "@/api/proto-http/frontend";

// heroColorwayToStorefront projects the admin/catalog `common_Colorway` that the
// hero blocks still deliver (GetHero returns common_Colorway[] for featured
// products) onto the lean `StorefrontColorway` the storefront card components now
// consume. This is the single boundary where the two colourway shapes meet: the
// catalogue/archive read paths already return StorefrontColorway, so once a hero
// product passes through here every downstream card renders one shape.
//
// The merchandising facts the storefront cards render (sale %, preorder, model
// height, updated_at) come from the admin read-projection ColorwayMerchandising.
// Two of the storefront display's public fields can't be produced in a pure map:
// model_wears_size_code and category_labels are id→name resolutions the backend
// does for the real projection but which need the dictionary here — hero cards
// don't surface model-wears, and their name falls back to the translation when no
// category labels are present, so both are left unset.
export function heroColorwayToStorefront(
  colorway: common_Colorway,
): StorefrontColorway {
  const merch = colorway.display?.merchandising;
  return {
    baseSku: colorway.baseSku,
    slug: colorway.slug,
    display: {
      thumbnail: colorway.display?.thumbnail,
      secondaryThumbnail: colorway.display?.secondaryThumbnail,
      brand: merch?.brand,
      collectionCode: merch?.collection,
      targetGender: merch?.targetGender,
      fit: merch?.fit,
      composition: merch?.composition,
      careInstructions: merch?.careInstructions,
      translations: colorway.display?.translations,
      salePercentage: merch?.salePercentage,
      preorder: merch?.preorder,
      modelWearsHeightCm: merch?.modelWearsHeightCm,
      modelWearsSizeCode: undefined,
      categoryLabels: undefined,
      updatedAt: colorway.updatedAt,
    },
    variants: [],
    prices: colorway.prices,
    media: [],
    sizeChart: undefined,
    colorCode: colorway.colorCode,
    soldOut: colorway.soldOut,
    status: colorway.status,
  };
}
