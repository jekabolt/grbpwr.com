import {
  common_GenderEnum,
  common_ProductMeasurement,
} from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";

import { getIconByCategoryId } from "./map_cataegories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  subCategoryId: number | undefined;
  typeId: number | undefined;
  gender: common_GenderEnum | undefined;
  measurements: common_ProductMeasurement[];
  className?: string;
  selectedSize?: number;
}

type IconComponentProps = React.SVGProps<SVGSVGElement> & {
  measurements?: common_ProductMeasurement[];
  selectedSize?: number;
};

export function CategoryThumbnail({
  categoryId,
  subCategoryId,
  typeId,
  measurements,
  className,
  gender,
  selectedSize,
}: CategoryThumbnailProps) {
  const { dictionary } = useDataContext();

  const subCategory = dictionary?.categories?.find(
    (c) => c.id === subCategoryId,
  );
  const type = dictionary?.categories?.find((t) => t.id === typeId);

  const IconComponent = getIconByCategoryId(
    categoryId,
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
      />
    </div>
  );
}
