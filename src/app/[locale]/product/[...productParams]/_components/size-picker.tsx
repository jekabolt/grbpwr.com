import { sendSizeSelectionEvent } from "@/lib/analitycs/sizes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/ui/hover-text";
import { Text } from "@/components/ui/text";

type Props = {
  sizeNames: { name: string; id: number }[];
  activeSizeId: number;
  outOfStock?: Record<number, boolean>;
  sizeQuantity?: Record<number, number>;
  isOneSize?: boolean;
  view?: "grid" | "line";
  className?: string;
  isMaxQuantity?: boolean;
  handleSizeSelect: (id: number) => void;
};

export function SizePicker({
  sizeNames,
  activeSizeId,
  outOfStock,
  sizeQuantity,
  isOneSize,
  view = "grid",
  className,
  isMaxQuantity,
  handleSizeSelect,
}: Props) {
  const handleAnalytics = (sizeName: string, outOfStock: boolean) => {
    sendSizeSelectionEvent({
      sizeName: sizeName,
      outOfStock: outOfStock,
    });
  };

  return (
    <div>
      <div
        className={cn(
          {
            "grid grid-cols-4 gap-x-3 gap-y-7": view === "grid",
            "flex w-full items-center justify-between": view === "line",
          },
          className,
        )}
      >
        {sizeNames?.map(({ name, id }) => {
          const isOutOfStock = outOfStock?.[id] || sizeQuantity?.[id] === 0;
          const isActive = activeSizeId === id;

          return (
            <Button
              disabled={!!isOutOfStock}
              variant={isOutOfStock ? "strikeThrough" : "default"}
              className={cn("border-b border-transparent leading-none", {
                // "border-textInactiveColor text-textInactiveColor":
                //   isActive && isOutOfStock,
                "border-textColor": isActive && !isOutOfStock,
                // "text-textInactiveColor": !isActive && isOutOfStock,
                "hover:border-textColor": !isActive && !isOutOfStock,
                "w-full": view === "line",
                "w-auto": view === "line" && isOneSize,
              })}
              key={id}
              onClick={() => handleSizeSelect(id)}
              onPointerDown={() => handleAnalytics(name, isOutOfStock)}
            >
              {sizeQuantity ? (
                <HoverText
                  defaultText={isOneSize ? "one size" : name}
                  hoveredText={`${sizeQuantity?.[id]} left`}
                  hoverTextCondition={sizeQuantity[id] > 5}
                />
              ) : (
                <Text variant="uppercase">{name}</Text>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
