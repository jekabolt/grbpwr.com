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
  1: TShirtIcon, //done
  2: PantsIcon, //done
  3: DressIcon, //done
  4: JacketIcon, //done
  5: SweaterIcon, //done
  6: BagIcon,
  7: SkirtIcon, //done
  8: ShortIcon, //done
  9: JacketIcon,
  10: CoatIcon, //done
  // no socks thumbnail
  11: OtherIcon, //done
  13: BraIcon, //done
  // no hat thumbnail
  14: OtherIcon, //done
  15: ScarfIcon, //done
  // no gloves thumbnail
  16: OtherIcon, //done
  // no shoes thumbnail
  17: OtherIcon, //done
  18: BeltIcon, //done
  19: BagIcon, //done
  20: OtherIcon, //done
} as const;

export function getIconByCategoryId(
  categoryId: number | undefined,
  gender: common_GenderEnum | undefined,
) {
  if (!categoryId) return OtherIcon;
  if (categoryId === 5) {
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
