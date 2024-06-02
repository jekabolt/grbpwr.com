import { Suspense } from "react";
import CartProductsList from "@/components/cart/CartProductsList";
import CoreLayout from "@/components/layouts/CoreLayout";
import CartProductsSkeleton from "@/components/skeletons/CartProductsSkeleton";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <CoreLayout>
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
            <p className="mb-8 text-sm">total:</p>
            <p className="mb-2 text-lg">170$</p>
            <button className="w-44 bg-black p-2 text-white">checkout</button>
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
