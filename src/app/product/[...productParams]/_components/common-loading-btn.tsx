import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Props {
  isLoading: boolean;
  preorder: string;
  isSaleApplied: boolean;
  priceMinusSale: string;
  priceWithSale: string;
  price: string;
  handleAddToCart: () => void;
}

export function CommonLoadingBtn({
  isLoading,
  preorder,
  isSaleApplied,
  priceMinusSale,
  priceWithSale,
  price,
  handleAddToCart,
}: Props) {
  return (
    <Button
      className={cn("blackTheme flex w-full justify-between uppercase", {
        "justify-center": isLoading,
      })}
      variant="simpleReverse"
      size="lg"
      onClick={handleAddToCart}
      loading={isLoading}
    >
      <Text variant="inherit">{preorder ? "preorder" : "add"}</Text>
      {isSaleApplied ? (
        <Text variant="inactive">
          {priceMinusSale}
          <Text component="span">{priceWithSale}</Text>
        </Text>
      ) : (
        <Text variant="inherit">{price}</Text>
      )}
    </Button>
  );
}
