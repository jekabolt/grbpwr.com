"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";
import { formatSizeName } from "@/lib/utils";

export default function CartItemSize({ sizeId }: { sizeId: string }) {
  const { dictionary } = useDataContext();

  const sizeName =
    dictionary?.sizes?.find((size) => size.id === Number(sizeId))?.name || "";

  if (!sizeName) return null;

  const formattedSizeName = formatSizeName(sizeName);

  return <Text variant="uppercase">{formattedSizeName}</Text>;
}
