import {
  DesktopOrderSummarySkeleton,
  MobileCollapsedOrderSummarySkeleton,
} from "@/app/[locale]/(checkout)/checkout/_components/checkout-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

function OrderDetailsSkeleton() {
  return (
    <div className="w-full min-h-0">
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
  );
}

export function OrderPageSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-6 md:hidden">
        <MobileCollapsedOrderSummarySkeleton />
        <OrderDetailsSkeleton />
      </div>
      <div className="hidden h-full min-h-0 md:grid md:grid-cols-2 md:items-start md:gap-28">
        <OrderDetailsSkeleton />
        <div className="hidden h-full min-h-0 w-full md:flex lg:sticky lg:top-16 lg:h-[calc(100dvh-6rem)] lg:max-h-[calc(100dvh-6rem)]">
          <DesktopOrderSummarySkeleton
            className="md:flex"
            showPromoInput={false}
            showPlaceOrderButton={false}
          />
        </div>
      </div>
    </>
  );
}
