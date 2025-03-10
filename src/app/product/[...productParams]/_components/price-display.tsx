import { common_ProductBody } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculatePriceWithSale } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export function PriceDisplay({
  productBody,
}: {
  productBody: common_ProductBody | undefined;
}) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const price = productBody?.price?.value || "0";
  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage !== "0";
  const currencyPrice = `${currencySymbols[selectedCurrency]} ${convertPrice(price)}`;
  const priceWithSale = calculatePriceWithSale(price, salePercentage);

  if (isSaleApplied) {
    return (
      <Text variant="inactive">
        {`${currencyPrice} - ${salePercentage}%`} ={" "}
        <Text variant={"inherit"} component="span">
          {`${currencySymbols[selectedCurrency]} ${priceWithSale}`}
        </Text>
      </Text>
    );
  }
  return <Text variant="inherit">{currencyPrice}</Text>;
}
