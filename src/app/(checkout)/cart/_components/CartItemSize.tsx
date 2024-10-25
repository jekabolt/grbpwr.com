"use client";

import { useDataContext } from "@/components/DataContext";

export default function CartItemSize({ sizeId }: { sizeId: string }) {
  const { dictionary } = useDataContext();

  const sizeName =
    dictionary?.sizes?.find((size) => size.id === Number(sizeId))?.name || "";

  if (!sizeName) return null;

  return <p>{sizeName}</p>;
}
