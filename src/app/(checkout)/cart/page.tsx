// import { CartProductsSkeleton } from "@/components/ui/skeleton";
"use client";

import { Suspense } from "react";
import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import CartProductsList from "./_components/CartProductsList";
import TotalPrice from "./_components/CartTotalPrice";

// todo: change cache
export const dynamic = "force-dynamic";

export default function CartPage() {
  const products = useCart((state) => state.products);
  const itemsQuantity = Object.keys(products).length;
  return (
    <FlexibleLayout
      headerType="flexible"
      footerType="mini"
      headerProps={{ right: "close" }}
    >
      <div className="relative flex h-full flex-col gap-10 py-24 sm:flex-row lg:px-32">
        <div className="w-full sm:w-1/2">
          <div className="w-full space-y-10">
            <div className="flex gap-3">
              <Text variant="uppercase">shopping cart</Text>
              <Text>[{itemsQuantity?.toString().padStart(2, "0")}]</Text>
            </div>
            <div className="w-full space-y-8">
              <Suspense
                fallback={
                  <div className="text-9xl font-bold text-yellow-400">
                    add shell, loading...
                  </div>
                }
              >
                <CartProductsList />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="relative grow">
          <div className="sticky top-20 space-y-6">
            <TotalPrice />
            <Button asChild size="lg" variant="main" className="uppercase">
              <Link href="/checkout">proceed to checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </FlexibleLayout>
  );
}
