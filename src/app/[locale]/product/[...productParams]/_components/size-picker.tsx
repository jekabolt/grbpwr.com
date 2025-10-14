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
  handleSizeSelect,
}: Props) {
  const handleAnalytics = (
    isTouch = false,
    sizeName: string,
    outOfStock: boolean,
  ) => {
    if (!isTouch && "ontouchstart" in window) return;

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
            "grid grid-cols-4 gap-y-7": view === "grid",
            "flex w-full items-center justify-between": view === "line",
          },
          className,
        )}
      >
        {sizeNames?.map(({ name, id }) => (
          <Button
            className={cn("border-b border-transparent leading-none", {
              "border-textColor": activeSizeId === id,
              "hover:border-textColor": !outOfStock?.[id],
              "w-full": view === "line",
              "w-auto": view === "line" && isOneSize,
            })}
            key={id}
            onClick={() => handleSizeSelect(id)}
            onMouseEnter={() =>
              handleAnalytics(false, name, outOfStock?.[id] || false)
            }
            onTouchStart={() =>
              handleAnalytics(true, name, outOfStock?.[id] || false)
            }
            disabled={outOfStock?.[id]}
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
        ))}
      </div>
    </div>
  );
}
