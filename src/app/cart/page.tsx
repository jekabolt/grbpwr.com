import { Suspense } from "react";
import CartProductsList from "@/components/cart/CartProductsList";
import CoreLayout from "@/components/layouts/CoreLayout";
import { CartProductsSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import Link from "next/link";
import ConfirmOrderForm from "@/components/forms/CheckoutForm";

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

            <Button asChild style={ButtonStyle.simpleButton}>
              <Link href="/cart/checkout">checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </CoreLayout>
  );
}
