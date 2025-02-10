"use client";

// import { SIZE_NAME_MAP } from "@/constants";
import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

export default function CartItemSize({ sizeId }: { sizeId: string }) {
  const { dictionary } = useDataContext();

  const sizeName =
    dictionary?.sizes?.find((size) => size.id === Number(sizeId))?.name || "";

  if (!sizeName) return null;

  return (
    <Text className="lowercase">
      {dictionary?.sizes?.find((dictS) => dictS.id === Number(sizeId))?.name ||
        ""}
    </Text>
  );
}
