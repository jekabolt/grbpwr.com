import CoreLayout from "@/components/layouts/CoreLayout";
import CartProductsList from "@/components/sections/Cart/CartProductsList";
import TotalPrice from "@/components/sections/Cart/TotalPrice";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import { CartProductsSkeleton } from "@/components/ui/Skeleton";
import { getCookieCart } from "@/lib/utils/cart";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cartItems = getCookieCart();

  return (
    <CoreLayout hidePopupCart>
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
              <Button asChild style={ButtonStyle.simpleButton}>
                <Link href="/cart/checkout">checkout</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
