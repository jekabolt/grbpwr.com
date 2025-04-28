import { SVGProps } from "react";
import { common_GenderEnum } from "@/api/proto-http/frontend";

import { BagIcon } from "@/components/ui/icons/bag";
import { BeltIcon } from "@/components/ui/icons/belt";
import { BraIcon } from "@/components/ui/icons/bra";
import { CoatIcon } from "@/components/ui/icons/coat";
import { DressIcon } from "@/components/ui/icons/dress";
import { JacketIcon } from "@/components/ui/icons/jacket";
import { OtherIcon } from "@/components/ui/icons/other";
import { PantsIcon } from "@/components/ui/icons/pants";
import { ScarfIcon } from "@/components/ui/icons/scarf";
import { ShortIcon } from "@/components/ui/icons/shorts";
import { SkirtIcon } from "@/components/ui/icons/skirt";
import { SweaterIcon } from "@/components/ui/icons/sweater";
import { TShirtIcon } from "@/components/ui/icons/t-shirt";
import { UnderwearFIcon } from "@/components/ui/icons/underwear-f";
import { UnderwearMIcon } from "@/components/ui/icons/underwear-m";

// Extended SVG props interface that includes lengthInfo
interface IconProps extends SVGProps<SVGSVGElement> {
  lengthInfo?: string;
}

export const CATEGORY_ICONS_MAP: Record<
  number,
  React.ComponentType<IconProps>
> = {
  1: TShirtIcon,
  2: PantsIcon,
  3: DressIcon,
  4: JacketIcon,
  5: SweaterIcon,
  6: JacketIcon,
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

  console.log(categoryId);

  return CATEGORY_ICONS_MAP[categoryId] || OtherIcon;
}
