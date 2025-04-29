import { common_Category, common_GenderEnum } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";

import { getIconByCategoryId } from "./map_cataegories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  subCategory: common_Category | undefined;
  gender: common_GenderEnum | undefined;
  className?: string;
}

export function CategoryThumbnail({
  categoryId,
  subCategory,
  className,
  gender,
}: CategoryThumbnailProps) {
  const IconComponent = getIconByCategoryId(categoryId, gender, subCategory);

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
      <IconComponent className="h-full w-full border border-blue-500" />
    </div>
  );
}
