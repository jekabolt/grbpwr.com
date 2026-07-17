import type {
  common_ColorwayFull,
  googletype_Decimal,
} from "@/api/proto-http/frontend";

// TODO(final-bump): The intermediate PR6 contract dropped per-colorway measurements —
// the size chart is style-owned now (R5). The final storefront projection exposes it as
// `StorefrontColorway.size_chart` (`PublicStyleSizeChart` / `PublicMeasurement`). When that
// lands, map it here and delete this compat shape; the measurement UI keeps its prop types.
export type ProductMeasurementCompat = {
  productSizeId?: number;
  measurementNameId?: number;
  measurementValue?: googletype_Decimal;
};

// colorwayMeasurements returns the measurement rows for a colorway. The intermediate
// contract carries none, so this is []; the measurement UI degrades to "no size table"
// until the final bump wires `size_chart` in.
export function colorwayMeasurements(
  _colorway: common_ColorwayFull | undefined,
): ProductMeasurementCompat[] {
  return [];
}
