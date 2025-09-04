import {
  common_GenderEnum,
  common_ProductMeasurement,
} from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Unit } from "@/app/product/[...productParams]/_components/measurements-table";

import { getIconByCategoryId } from "./map_categories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  subCategoryId: number | undefined;
  typeId: number | undefined;
  gender: common_GenderEnum | undefined;
  measurements: common_ProductMeasurement[];
  className?: string;
  selectedSize?: number;
  unit?: Unit;
}

type IconComponentProps = React.SVGProps<SVGSVGElement> & {
  measurements?: common_ProductMeasurement[];
  selectedSize?: number;
  unit?: Unit;
};

export function CategoryThumbnail({
  categoryId,
  subCategoryId,
  typeId,
  measurements,
  className,
  gender,
  selectedSize,
  unit = Unit.CM,
}: CategoryThumbnailProps) {
  const { dictionary } = useDataContext();

  const category = dictionary?.categories?.find((c) => c.id === categoryId);

  const subCategory = dictionary?.categories?.find(
    (c) => c.id === subCategoryId,
  );
  const type = dictionary?.categories?.find((t) => t.id === typeId);

  const IconComponent = getIconByCategoryId(
    category,
    gender,
    subCategory,
    type,
  ) as React.ComponentType<IconComponentProps>;

  if (!IconComponent) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center",
        className,
      )}
    >
      <IconComponent
        className="h-full w-full"
        measurements={measurements}
        selectedSize={selectedSize}
        unit={unit}
      />
    </div>
  );
}
