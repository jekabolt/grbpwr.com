"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";

export default function CartItemSize({ sizeId }: { sizeId: string }) {
  const { dictionary } = useHeroContext();

  const sizeName =
    dictionary?.sizes?.find((size) => size.id === Number(sizeId))?.name || "";

  if (!sizeName) return null;

  return <p>{sizeName}</p>;
}
