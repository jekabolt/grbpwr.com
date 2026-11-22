"use client";

import { cn } from "@/lib/utils";
import { useShopBrand } from "@/components/contexts/ShopContext";
import { Text } from "@/components/ui/text";

// The shop's logo from its workspace brand block; its name when it has none.
// A plain <img>: logos live on team storage hosts that next/image can't list.
export function ShopLogo({ className }: { className?: string }) {
  const { name, logoUrl } = useShopBrand();
  if (!logoUrl) {
    return (
      <Text variant="uppercase" className={className}>
        {name}
      </Text>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt={name} className={cn("object-contain", className)} />
  );
}
