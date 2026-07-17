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
// The lean projection carries no variants/size-chart and no sale/category/preorder
// (those live on the internal ColorwayMerchandising, deliberately not exposed to
// the storefront), so hero cards degrade to the same fields catalogue cards show.
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
