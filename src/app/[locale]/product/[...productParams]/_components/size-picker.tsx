import { sendSizeSelectionEvent } from "@/lib/analitycs/sizes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/ui/hover-text";
import { Overlay } from "@/components/ui/overlay";
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
  onOutOfStockHover?: (sizeId: number | null) => void;
  shouldBlink?: boolean;
};

export function SizePicker({
  sizeNames,
  activeSizeId,
  outOfStock,
  sizeQuantity,
  isOneSize,
  view = "grid",
  className,
  shouldBlink = false,
  handleSizeSelect,
  onOutOfStockHover,
}: Props) {
  const handleAnalytics = (sizeName: string, outOfStock: boolean) => {
    sendSizeSelectionEvent({
      sizeName: sizeName,
      outOfStock: outOfStock,
    });
  };

  return (
    <div className="relative">
      {shouldBlink && <Overlay color="highlight" cover="container" />}
      <div
        className={cn(
          {
            "grid grid-cols-4 gap-x-3 gap-y-7": view === "grid",
            "flex w-full flex-row items-center justify-center gap-5":
              view === "line",
          },
          className,
        )}
      >
        {sizeNames?.map(({ name, id }) => {
          const isTrulyOutOfStock = outOfStock?.[id];
          const hasNoAvailableQty = sizeQuantity?.[id] === 0;
          const isOutOfStock = isTrulyOutOfStock || hasNoAvailableQty;
          const isActive = activeSizeId === id;
          const isDisabled = hasNoAvailableQty && !isTrulyOutOfStock;

          return (
            <Button
              type="button"
              disabled={isDisabled}
              variant={isOutOfStock ? "strikeThrough" : "default"}
              className={cn("border-b border-transparent leading-none", {
                "border-textColor": isActive && !isOutOfStock,
                "hover:border-textColor": !isActive && !isOutOfStock,
                "px-3 py-0.5": view === "line" && !isOneSize,
                // "w-auto": view === "line" && isOneSize,
                "!text-textColor": isOutOfStock && isActive,
                "hover:!text-textColor": isOutOfStock && !isActive,
              })}
              key={id}
              onClick={() => handleSizeSelect(id)}
              onPointerDown={() => handleAnalytics(name, isOutOfStock)}
              onMouseEnter={() => isOutOfStock && onOutOfStockHover?.(id)}
              onMouseLeave={() => isOutOfStock && onOutOfStockHover?.(null)}
            >
              {sizeQuantity?.[id] && sizeQuantity?.[id] > 0 ? (
                <HoverText
                  defaultText={isOneSize ? "one size" : name}
                  hoveredText={`${sizeQuantity?.[id]} left`}
                  hoverTextCondition={sizeQuantity?.[id] > 5}
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
