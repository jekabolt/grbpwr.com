import { common_GenderEnum } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";

import { getIconByCategoryId } from "./map_cataegories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  gender: common_GenderEnum | undefined;
  className?: string;
  size?: number;
  lengthInfo?: string;
}

export function CategoryThumbnail({
  categoryId,
  className,
  gender,
  lengthInfo = "56",
}: CategoryThumbnailProps) {
  const IconComponent = getIconByCategoryId(categoryId, gender);

  if (!IconComponent) {
    return null;
  }

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <IconComponent
        className="h-full w-full border border-blue-500 p-3 lg:p-5"
        lengthInfo={lengthInfo}
      />
    </div>
  );
}
