import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/ui/hover-text";
import { Text } from "@/components/ui/text";

type Props = {
  sizeNames: { name: string; id: number }[];
  activeSizeId: number;
  outOfStock: Record<number, boolean>;
  sizeQuantity: Record<number, number>;
  isOneSize: boolean;
  handleSizeSelect: (id: number) => void;
};

export function SizePicker({
  sizeNames,
  activeSizeId,
  outOfStock,
  sizeQuantity,
  isOneSize,
  handleSizeSelect,
}: Props) {
  return (
    <div>
      {isOneSize ? (
        <Text variant="uppercase">one size</Text>
      ) : (
        <div className="grid grid-cols-4 gap-y-7">
          {sizeNames?.map(({ name, id }) => (
            <Button
              className={cn("border-b border-transparent", {
                "border-textColor": activeSizeId === id,
                "hover:border-textColor": !outOfStock[id],
              })}
              key={id}
              onClick={() => handleSizeSelect(id)}
              disabled={outOfStock[id]}
            >
              <HoverText
                defaultText={name}
                hoveredText={`${sizeQuantity[id]} left`}
                hoverTextCondition={sizeQuantity[id] > 5}
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
