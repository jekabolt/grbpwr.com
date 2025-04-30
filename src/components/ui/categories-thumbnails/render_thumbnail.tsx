import {
  common_Category,
  common_GenderEnum,
  common_ProductMeasurement,
} from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { MeasurementType } from "@/app/product/[...productParams]/_components/select-size-add-to-cart/useData";

import { getIconByCategoryId } from "./map_cataegories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  subCategory?: common_Category | undefined;
  gender: common_GenderEnum | undefined;
  measurements: common_ProductMeasurement[];
  className?: string;
  selectedSize?: number;
  type: MeasurementType;
}

type IconComponentProps = React.SVGProps<SVGSVGElement> & {
  measurements?: common_ProductMeasurement[];
  selectedSize?: number;
};

export function CategoryThumbnail({
  categoryId,
  subCategory,
  type,
  measurements,
  className,
  gender,
  selectedSize,
}: CategoryThumbnailProps) {
  const IconComponent = getIconByCategoryId(
    categoryId,
    gender,
    type,
    subCategory,
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
