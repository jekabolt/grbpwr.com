"use client";

import { useDataContext } from "@/components/DataContext";

export default function Size({ sizeId }: { sizeId: number }) {
  const { dictionary } = useDataContext();

  return <>{dictionary?.sizes?.find((size) => size.id === sizeId)?.name}</>;
}
