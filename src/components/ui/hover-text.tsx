import { cn } from "@/lib/utils";

import { Text } from "./text";

interface Props {
  defaultText: string;
  hoveredText: string;
  hoverTextCondition?: boolean;
}

export function HoverText({
  defaultText,
  hoveredText,
  hoverTextCondition,
}: Props) {
  return (
    <div className="group relative">
      <Text
        variant="uppercase"
        className={cn("transition-opacity group-hover:opacity-0", {
          "group-hover:opacity-100": hoverTextCondition,
        })}
      >
        {defaultText}
      </Text>
      <Text
        variant="uppercase"
        className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100",
          {
            "group-hover:opacity-0": hoverTextCondition,
          },
        )}
      >
        {hoveredText}
      </Text>
    </div>
  );
}
