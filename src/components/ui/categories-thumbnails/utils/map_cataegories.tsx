import { common_GenderEnum } from "@/api/proto-http/frontend";

import { BagIcon } from "@/components/ui/categories-thumbnails/bag";
import { BeltIcon } from "@/components/ui/categories-thumbnails/belt";
import { BraIcon } from "@/components/ui/categories-thumbnails/bra";
import { CoatIcon } from "@/components/ui/categories-thumbnails/coat";
import { DressIcon } from "@/components/ui/categories-thumbnails/dress";
import { JacketIcon } from "@/components/ui/categories-thumbnails/jacket";
import { OtherIcon } from "@/components/ui/categories-thumbnails/other";
import { ScarfIcon } from "@/components/ui/categories-thumbnails/scarf";

import { PantsIcon } from "../pants";
import { ShortIcon } from "../shorts";
import { SkirtIcon } from "../skirt";
import { SweaterIcon } from "../sweater";
import { TShirtIcon } from "../t_shirt";
import { UnderwearFIcon } from "../underwear_f";
import { UnderwearMIcon } from "../underwear_m";

export const CATEGORY_ICONS_MAP: Record<
  number,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  1: TShirtIcon,
  2: PantsIcon,
  3: DressIcon,
  4: JacketIcon,
  5: SweaterIcon,
  6: PantsIcon,
  7: SkirtIcon,
  8: ShortIcon,
  9: JacketIcon,
  10: CoatIcon,
  // no socks thumbnail
  11: OtherIcon,
  13: BraIcon,
  // no hat thumbnail
  14: OtherIcon,
  15: ScarfIcon,
  // no gloves thumbnail
  16: OtherIcon,
  // no shoes thumbnail
  17: OtherIcon,
  18: BeltIcon,
  19: BagIcon,
  20: OtherIcon,
} as const;

export function getIconByCategoryId(
  categoryId: number | undefined,
  gender: common_GenderEnum | undefined,
) {
  if (!categoryId) return OtherIcon;
  if (categoryId === 12) {
    if (gender === "GENDER_ENUM_FEMALE") {
      return UnderwearFIcon;
    }
    if (gender === "GENDER_ENUM_MALE") {
      return UnderwearMIcon;
    }
    return UnderwearMIcon;
  }
  return CATEGORY_ICONS_MAP[categoryId] || OtherIcon;
}
