import { common_ProductFull } from "@/api/proto-http/frontend";
import { CARE_INSTRUCTIONS_MAP, currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculatePriceWithSale, getFullComposition } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

const lowStockTextMap: Record<number, string> = {
  1: "only one left",
  2: "only two left",
  3: "only three left",
  4: "only four left",
  5: "only five left",
};

export function useData({
  product,
  activeSizeId,
}: {
  product: common_ProductFull;
  activeSizeId?: number | undefined;
}) {
  const { dictionary } = useDataContext();
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const productBody = product.product?.productDisplay?.productBody;
  const name = productBody?.name;
  const preorder = getPreorderDate(product);
  const color = productBody?.color;

  const sizes = product.sizes;
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

  const activeSizeQuantity = activeSizeId ? sizeQuantity[activeSizeId] : 0;
  const lowStockText =
    activeSizeId && activeSizeQuantity <= 5 && activeSizeQuantity > 0
      ? lowStockTextMap[activeSizeQuantity]
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
  const triggerText = activeSizeName
    ? `${sizeText} ${lowStockText}`
    : noSizeText;

  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage !== "0";
  const currency = currencySymbols[selectedCurrency];
  const price = `${currency} ${convertPrice(productBody?.price?.value || "0")}`;
  const priceMinusSale = `${price} - ${salePercentage}% = `;
  const priceWithSale = `${currency} ${calculatePriceWithSale(productBody?.price?.value || "0", salePercentage)}`;

  const description = productBody?.description;
  const productComposition = productBody?.composition;
  const productCare = productBody?.careInstructions;
  const composition = getFullComposition(productComposition);
  const care = productCare
    ?.split(",")
    .map((c) => CARE_INSTRUCTIONS_MAP[c.trim()]);

  const modelWearSizeId = productBody?.modelWearsSizeId;
  const modelWearSize = dictionary?.sizes?.find(
    (s) => s.id === modelWearSizeId,
  )?.name;
  const modelWearHeight = productBody?.modelWearsHeightCm;
  const modelWearText =
    modelWearSize && modelWearHeight
      ? `model is ${modelWearHeight}cm and wears size ${modelWearSize}`
      : "";

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
    description,
    productComposition,
    productCare,
    composition,
    care,
    modelWearText,
    color,
    name,
  };
}
