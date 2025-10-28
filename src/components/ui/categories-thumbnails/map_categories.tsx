import { common_Category, common_GenderEnum } from "@/api/proto-http/frontend";

import { OtherIcon } from "@/components/ui/icons/other";
import { UnderwearFIcon } from "@/components/ui/icons/underwear-f";
import { UnderwearMIcon } from "@/components/ui/icons/underwear-m";

import { BeltIcon } from "../icons/belt";
import { BlazerIcon } from "../icons/blazer";
import { BraIcon } from "../icons/bra";
import { CoatIcon } from "../icons/coat";
import { DressIcon } from "../icons/dress";
import { GlovesIcon } from "../icons/gloves";
import { JacketIcon } from "../icons/jacket";
import { PantsIcon } from "../icons/pants";
import { ShortIcon } from "../icons/shorts";
import { SkirtIcon } from "../icons/skirt";
import { SweaterIcon } from "../icons/sweater";
import { TShirtIcon } from "../icons/t-shirt";
import { TankIcon } from "../icons/tank";
import { VestIcon } from "../icons/vest";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TopCategoryIcons: Record<string, IconComponent> = {
  outerwear: JacketIcon,
  tops: TShirtIcon,
  bottoms: PantsIcon,
  dresses: DressIcon,
  underwear: UnderwearMIcon,
  accessories: OtherIcon,
  shoes: OtherIcon,
  bags: OtherIcon,
  objects: OtherIcon,
} as const;

const SubCategoryIcons: Record<string, IconComponent> = {
  coats: CoatIcon,
  vests: VestIcon,
  tanks: TankIcon,
  crop: TankIcon,
  sweaters_knits: SweaterIcon,
  shirts: TShirtIcon,
  hoodies_sweatshirts: SweaterIcon,
  pants: PantsIcon,
  shorts: ShortIcon,
  skirts: SkirtIcon,
  bralettes: BraIcon,
  belts: BeltIcon,
  gloves: GlovesIcon,
} as const;

const TypeIcons: Record<string, IconComponent> = {
  blazer: BlazerIcon,
} as const;

export function getIconByCategoryId(
  category: common_Category | undefined,
  gender: common_GenderEnum | undefined,
  subCategory?: common_Category,
  type?: common_Category,
): IconComponent {
  if (!category?.id) return OtherIcon;

  if (category.id === 5 && gender === "GENDER_ENUM_FEMALE") {
    return UnderwearFIcon;
  }

  const typeName = type?.name?.toLowerCase() || "";
  if (typeName) {
    const typeIcon = TypeIcons[typeName];
    if (typeIcon) return typeIcon;
  }

  const subName = subCategory?.name?.toLowerCase() || "";
  if (subName) {
    const subCategoryIcon = SubCategoryIcons[subName];
    if (subCategoryIcon) return subCategoryIcon;
  }

  const topName = category?.name?.toLowerCase() || "";
  if (topName) return TopCategoryIcons[topName] || OtherIcon;

  return OtherIcon;
}
