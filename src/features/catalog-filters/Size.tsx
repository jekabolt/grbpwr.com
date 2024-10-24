"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";

export default function Size({ sizeId }: { sizeId: number }) {
  const { dictionary } = useHeroContext();

  return <>{dictionary?.sizes?.find((size) => size.id === sizeId)?.name}</>;
}
