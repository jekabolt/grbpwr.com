import { common_Category, common_GenderEnum } from "@/api/proto-http/frontend";

import { BeltIcon } from "@/components/ui/icons/belt";
import { CoatIcon } from "@/components/ui/icons/coat";
import { DressIcon } from "@/components/ui/icons/dress";
import { OtherIcon } from "@/components/ui/icons/other";
import { ShortIcon } from "@/components/ui/icons/shorts";
import { SkirtIcon } from "@/components/ui/icons/skirt";
import { SweaterIcon } from "@/components/ui/icons/sweater";
import { TShirtIcon } from "@/components/ui/icons/t-shirt";
import { UnderwearFIcon } from "@/components/ui/icons/underwear-f";
import { UnderwearMIcon } from "@/components/ui/icons/underwear-m";

import { BlazerIcon } from "../icons/blazer";
import { BraIcon } from "../icons/bra";
import { GlovesIcon } from "../icons/gloves";
import { JacketIcon } from "../icons/jacket";
import { PantsIcon } from "../icons/pants";
import { TankIcon } from "../icons/tank";
import { VestIcon } from "../icons/vest";

enum MainCategories {
  OUTERWEAR = 1,
  TOPS = 2,
  BOTTOMS = 3,
  DRESSES = 4,
  UNDERWEAR = 5,
  ACCESSORIES = 6,
  SHOES = 7,
  BAGS = 8,
  OBJECTS = 9,
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SPECIAL_CASES = {
  "jackets:blazer": BlazerIcon,
} as const;

const CATEGORY_MAP: Record<MainCategories, IconComponent> = {
  [MainCategories.OUTERWEAR]: JacketIcon,
  [MainCategories.TOPS]: TShirtIcon,
  [MainCategories.BOTTOMS]: PantsIcon,
  [MainCategories.DRESSES]: DressIcon,
  [MainCategories.UNDERWEAR]: UnderwearMIcon,
  [MainCategories.ACCESSORIES]: OtherIcon,
  [MainCategories.SHOES]: OtherIcon,
  [MainCategories.BAGS]: OtherIcon,
  [MainCategories.OBJECTS]: OtherIcon,
};

const SUBCATEGORY_MAP: Record<string, IconComponent> = {
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
};

export function getIconByCategoryId(
  categoryId: MainCategories | undefined,
  gender: common_GenderEnum | undefined,
  subCategory?: common_Category,
  type?: common_Category,
): IconComponent {
  if (!categoryId || !(categoryId in CATEGORY_MAP)) return OtherIcon;

  const subCategoryName = subCategory?.name?.toLowerCase();
  const typeName = type?.name?.toLowerCase();

  if (subCategoryName && typeName) {
    const specialCase =
      SPECIAL_CASES[
        `${subCategoryName}:${typeName}` as keyof typeof SPECIAL_CASES
      ];
    if (specialCase) return specialCase;
  }

  if (subCategoryName && subCategoryName in SUBCATEGORY_MAP) {
    return SUBCATEGORY_MAP[subCategoryName];
  }

  if (
    categoryId === MainCategories.UNDERWEAR &&
    gender === "GENDER_ENUM_FEMALE"
  ) {
    return UnderwearFIcon;
  }

  return CATEGORY_MAP[categoryId];
}
