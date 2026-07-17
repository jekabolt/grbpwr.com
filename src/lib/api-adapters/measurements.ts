import type {
  googletype_Decimal,
  StorefrontColorway,
} from "@/api/proto-http/frontend";

// The size chart is style-owned (R5) and reaches the storefront as
// `StorefrontColorway.size_chart` (`PublicStyleSizeChart` / `PublicMeasurement`).
// A PublicMeasurement carries the public size (`size.sku_ord`, the storefront's
// per-size key) and the measurement NAME as a string. The measurement UI
// (measurements-table, categories-thumbnails, t-shirt) still matches rows by
// `measurementNameId` + `productSizeId`, so we keep this compat shape: productSizeId
// = the public size ordinal, and measurementNameId resolved from the dictionary by
// name. The measurement-name dictionary is passed in because this stays a pure map.
export type ProductMeasurementCompat = {
  productSizeId?: number;
  measurementNameId?: number;
  measurementValue?: googletype_Decimal;
};

type MeasurementDictEntry = { id?: number; name?: string };

// colorwayMeasurements flattens the storefront size chart into the compat rows the
// measurement UI consumes. Returns [] when the colourway carries no chart.
export function colorwayMeasurements(
  colorway: StorefrontColorway | undefined,
  measurementDict?: MeasurementDictEntry[],
): ProductMeasurementCompat[] {
  const cells = colorway?.sizeChart?.cells || [];
  return cells.map((cell) => ({
    productSizeId: cell.size?.skuOrd,
    measurementNameId: measurementDict?.find(
      (m) => m.name?.toLowerCase() === cell.measurementName?.toLowerCase(),
    )?.id,
    measurementValue: cell.value,
  }));
}
