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

import { BraIcon } from "../icons/bra";
import { GlovesIcon } from "../icons/gloves";
import { JacketIcon } from "../icons/jacket";
import { PantsIcon } from "../icons/pants";
import { TankIcon } from "../icons/tank";
import { VestIcon } from "../icons/vest";

export const MAIN_CATEGORIES = {
  OUTERWEAR: 1,
  TOPS: 2,
  BOTTOMS: 3,
  DRESSES: 4,
  UNDERWEAR: 5,
  ACCESSORIES: 6,
  SHOES: 7,
  BAGS: 8,
  OBJECTS: 9,
};

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface CategoryConfig {
  defaultIcon: IconComponent;
  subcategories: Record<string, IconComponent>;
}

export const CATEGORY_MAP: Record<number, CategoryConfig> = {
  [MAIN_CATEGORIES.OUTERWEAR]: {
    defaultIcon: JacketIcon,
    subcategories: {
      coats: CoatIcon,
      vests: VestIcon,
    },
  },
  [MAIN_CATEGORIES.TOPS]: {
    defaultIcon: TShirtIcon,
    subcategories: {
      tanks: TankIcon,
      sweaters_knits: SweaterIcon,
      shirts: TShirtIcon,
      hoodies_sweatshirts: SweaterIcon,
    },
  },
  [MAIN_CATEGORIES.BOTTOMS]: {
    defaultIcon: PantsIcon,
    subcategories: {
      pants: PantsIcon,
      shorts: ShortIcon,
      skirts: SkirtIcon,
    },
  },
  [MAIN_CATEGORIES.UNDERWEAR]: {
    defaultIcon: BraIcon,
    subcategories: {
      bralettes: BraIcon,
    },
  },
  [MAIN_CATEGORIES.DRESSES]: {
    defaultIcon: DressIcon,
    subcategories: {},
  },
  [MAIN_CATEGORIES.ACCESSORIES]: {
    defaultIcon: OtherIcon,
    subcategories: {
      belts: BeltIcon,
      gloves: GlovesIcon,
    },
  },
  [MAIN_CATEGORIES.SHOES]: {
    defaultIcon: OtherIcon,
    subcategories: {},
  },
  [MAIN_CATEGORIES.BAGS]: {
    defaultIcon: OtherIcon,
    subcategories: {},
  },
  [MAIN_CATEGORIES.OBJECTS]: {
    defaultIcon: OtherIcon,
    subcategories: {},
  },
};

export function getIconByCategoryId(
  categoryId: number | undefined,
  gender: common_GenderEnum | undefined,
  subCategory?: common_Category,
): IconComponent {
  if (!categoryId) return OtherIcon;

  const category = CATEGORY_MAP[categoryId] || {
    defaultIcon: OtherIcon,
    subcategories: {},
  };

  if (subCategory?.name) {
    const subCategoryName = subCategory.name.toLowerCase();
    if (subCategoryName in category.subcategories) {
      return category.subcategories[subCategoryName];
    }
  }

  // Only fall back to gender-based underwear icons if no specific subcategory is found
  if (categoryId === MAIN_CATEGORIES.UNDERWEAR) {
    return gender === "GENDER_ENUM_FEMALE" ? UnderwearFIcon : UnderwearMIcon;
  }

  return category.defaultIcon;
}
