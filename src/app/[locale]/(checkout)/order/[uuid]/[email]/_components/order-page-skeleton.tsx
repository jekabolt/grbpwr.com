import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

export function OrderPageSkeleton() {
  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-52">
      {/* Left Section */}
      <div className="w-full">
        {/* Order ID and Date */}
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">order id</Text>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">order date</Text>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Status and Tracking */}
        <div className="flex flex-col items-center justify-between gap-y-6 border-b border-textInactiveColor py-6 lg:flex-row">
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">status</Text>
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex w-full flex-row justify-between gap-4 lg:flex-col">
            <Text variant="uppercase">tracking number</Text>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Secondary Info */}
        <div className="w-full space-y-6">
          <div className="flex flex-row items-center justify-between border-b border-textInactiveColor py-6">
            <div className="flex w-full flex-col gap-4">
              <Text variant="uppercase">shipping address</Text>
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <Text variant="uppercase">billing address</Text>
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-b border-textInactiveColor pb-6">
            <Text variant="uppercase">shipping method</Text>
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex flex-col gap-4">
            <Text variant="uppercase">payment method</Text>
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full space-y-20">
        {/* Order Summary */}
        <div className="space-y-8">
          <Text variant="uppercase">order summary</Text>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Text variant="uppercase">discount code</Text>
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex justify-between">
              <Text variant="uppercase">promo discount</Text>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Text variant="uppercase">shipping:</Text>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <div className="flex justify-between border-t border-textInactiveColor pt-3">
            <Text variant="uppercase">grand total:</Text>
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Order Products */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24 shrink-0" />
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
