import { Suspense } from "react";
import Link from "next/link";

import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
// import { CartProductsSkeleton } from "@/components/ui/skeleton";
import NavigationLayout from "@/app/_components/navigation-layout";

import CartProductsList from "./_components/CartProductsList";
import TotalPrice from "./_components/TotalPrice";

// todo: change cache
export const dynamic = "force-dynamic";

export default async function CartPage() {
  return (
    <NavigationLayout>
      <div className="relative flex gap-32">
        <div className="w-1/2">
          <div className="w-full">
            <p className="mb-8 text-sm">order summary:</p>
            <div className="space-y-8">
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
          <div className="sticky top-20">
            <TotalPrice />
            <Button asChild size="lg" variant="main">
              <Link href="/checkout">checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
