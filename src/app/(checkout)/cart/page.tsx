import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CartProductsSkeleton } from "@/components/ui/skeleton";
import NavigationLayout from "@/app/_components/navigation-layout";

import CartProductsList from "./_components/CartProductsList";
// import TotalPrice from "@/features/cart/TotalPrice";
import { getCookieCart } from "./_components/utils";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cartItems = await getCookieCart();

  return (
    <NavigationLayout>
      <div className="relative flex gap-32">
        <div className="w-1/2">
          <div className="w-full">
            <p className="mb-8 text-sm">order summary:</p>
            <div className="space-y-8">
              <Suspense fallback={<CartProductsSkeleton />}>
                <CartProductsList />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="relative grow">
          <div className="sticky top-20">
            {/* <p className="mb-8 text-sm">total:</p>
            <p className="mb-2 text-lg">170$</p> */}
            {/* <TotalPrice /> */}

            {Object.keys(cartItems?.products || {}).length && (
              <Button asChild size="lg" variant="main">
                <Link href="/checkout">checkout</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
