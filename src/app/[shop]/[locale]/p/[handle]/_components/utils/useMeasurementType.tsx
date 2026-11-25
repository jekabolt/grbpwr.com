import { StorefrontColorway } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/contexts/DataContext";

export type MeasurementType = "clothing" | "ring" | "shoe";

// StorefrontColorwayDisplay.category_labels is the resolved [top, sub, type] name
// list. We resolve those back to dictionary ids so the size-guide diagram (which is
// keyed by category id) renders, and derive the table type from the labels: a
// "rings" type → the ring table, a "shoes" top category → the shoe table, else the
// clothing measurement table.
export function useMeasurementType({
  product,
}: {
  product: StorefrontColorway;
}) {
  const { dictionary } = useDataContext();
  const [topLabel, subLabel, typeLabel] = product.display?.categoryLabels || [];

  const idForLabel = (label?: string): number | undefined =>
    label
      ? dictionary?.categories?.find(
          (c) => c.name?.toLowerCase() === label.toLowerCase(),
        )?.id
      : undefined;

  const categoryId = idForLabel(topLabel);
  const subCategoryId = idForLabel(subLabel);
  const typeId = idForLabel(typeLabel);

  const getMeasurementType = (): MeasurementType => {
    if (typeLabel?.toLowerCase() === "rings") return "ring";
    if (topLabel?.toLowerCase() === "shoes") return "shoe";
    return "clothing";
  };

  return {
    measurementType: getMeasurementType(),
    subCategoryId,
    typeId,
    categoryId,
  };
}
