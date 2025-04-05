import { common_GenderEnum } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";

import { getIconByCategoryId } from "./map_cataegories";

interface CategoryThumbnailProps {
  categoryId: number | undefined;
  gender: common_GenderEnum | undefined;
  className?: string;
  size?: number;
}

export function CategoryThumbnail({
  categoryId,
  className,
  gender,
}: CategoryThumbnailProps) {
  const IconComponent = getIconByCategoryId(categoryId, gender);

  if (!IconComponent) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <IconComponent className="h-full p-3 lg:p-5" />
    </div>
  );
}
