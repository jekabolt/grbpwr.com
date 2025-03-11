import { common_ProductFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculatePriceWithSale } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

export function useData({
  product,
  activeSizeId,
}: {
  product: common_ProductFull;
  activeSizeId: number | undefined;
}) {
  const { dictionary } = useDataContext();
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const sizes = product.sizes;
  const productBody = product.product?.productDisplay?.productBody;
  const preorder = getPreorderDate(product);

  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const sizeQuantity =
    product.sizes?.reduce(
      (acc, size) => {
        acc[size.sizeId as number] = Number(size.quantity?.value || "0");
        return acc;
      },
      {} as Record<number, number>,
    ) || {};

  const activeSizeName = activeSizeId
    ? sizeNames?.find((size) => size.id === activeSizeId)?.name
    : "";

  const isOneSize =
    sizeNames?.length === 1 && sizeNames[0].name.toLowerCase() === "os";

  const categoryId = productBody?.topCategoryId;
  const category = dictionary?.categories?.find(
    (c) => c.id === categoryId,
  )?.name;

  const isShoes = category?.toLowerCase().includes("shoes");
  const noSizeText = isShoes ? "select size (eu)" : "select size";
  const sizeText = isShoes ? `${activeSizeName} (eu)` : activeSizeName;
  const triggerText = activeSizeName ? sizeText : noSizeText;

  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage !== "0";
  const currency = currencySymbols[selectedCurrency];
  const price = `${currency} ${convertPrice(productBody?.price?.value || "0")}`;
  const priceMinusSale = `${price} - ${salePercentage}% = `;
  const priceWithSale = `${currency} ${calculatePriceWithSale(productBody?.price?.value || "0", salePercentage)}`;

  return {
    triggerText,
    sizeNames,
    preorder,
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
    isOneSize,
    sizeQuantity,
  };
}
