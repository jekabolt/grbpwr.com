import NavigationLayout from "@/components/layouts/NavigationLayout";
import CartProductsList from "@/features/cart/CartProductsList";
import TotalPrice from "@/features/cart/TotalPrice";
import { Button } from "@/components/ui/button";
import { CartProductsSkeleton } from "@/components/ui/skeleton";
import { getCookieCart } from "@/features/cart/utils";
import Link from "next/link";
import { Suspense } from "react";

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
                <Link href="/cart/checkout">checkout</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
