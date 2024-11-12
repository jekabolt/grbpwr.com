import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

export function OrderPageSkeleton() {
  return (
    <div>
      {/* First Grid - Order Details */}
      <div className="grid min-h-52 gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-5">
        <div className="space-y-4">
          <Text variant="inactive">order id</Text>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">date</Text>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">items</Text>
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">status</Text>
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Second Grid - Shipping/Payment Details */}
      <div className="grid min-h-52 gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-5">
        <div className="space-y-4">
          <Text variant="inactive">shipping address</Text>
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">billing address</Text>
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">shipping method</Text>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">payment method</Text>
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-4">
          <Text variant="inactive">tracking number</Text>
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Cart Products List */}
      <div className="lg:w-1/3">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full max-w-[200px]" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
