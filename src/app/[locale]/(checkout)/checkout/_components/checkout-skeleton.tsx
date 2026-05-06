import { Skeleton } from "@/components/ui/skeleton";

function MobileOrderSummarySkeleton() {
  return (
    <div className="space-y-0 border border-textInactiveColor p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-16 shrink-0" />
      </div>
    </div>
  );
}

function MobileExpandedOrderSummarySkeleton() {
  return (
    <div className="space-y-0 border border-textInactiveColor p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-16 shrink-0" />
      </div>
      <div className="space-y-4 pt-6">
        <div className="flex gap-3">
          <Skeleton className="h-[90px] min-w-[90px] shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="hidden space-y-8 lg:block">
      <Skeleton className="h-4 w-28" />
      <div className="flex max-h-[50vh] flex-col gap-4">
        <div className="flex gap-4">
          <Skeleton className="h-24 w-24 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full max-w-[160px]" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <Skeleton className="h-10 w-full" />
        <div className="mt-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="pt-5">
            <div className="flex justify-between border-t border-textInactiveColor pt-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldsGroupSkeleton({
  titleWidth,
  fieldCount = 2,
}: {
  titleWidth: string;
  fieldCount?: number;
}) {
  return (
    <div className="space-y-4 lg:space-y-8">
      <div className="flex items-center gap-x-6">
        <Skeleton className="h-4 w-8 shrink-0" />
        <Skeleton className="h-4 shrink-0" style={{ width: titleWidth }} />
      </div>
      <div className="space-y-4 lg:ml-14">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function CheckoutFormSkeleton() {
  return (
    <div className="relative space-y-14 lg:space-y-0">
      <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
        <div className="block lg:hidden">
          <MobileExpandedOrderSummarySkeleton />
        </div>
        <div className="space-y-10 lg:space-y-16">
          <FieldsGroupSkeleton titleWidth="5rem" fieldCount={3} />
          <FieldsGroupSkeleton titleWidth="4rem" fieldCount={5} />
          <FieldsGroupSkeleton titleWidth="7rem" fieldCount={4} />
        </div>
        <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
          <OrderSummarySkeleton />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutLoginSkeleton() {
  return (
    <div className="relative h-full space-y-14 lg:space-y-0">
      <div className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center gap-14 lg:grid lg:min-h-0 lg:grid-cols-2 lg:justify-start lg:gap-28">
        <div className="fixed inset-x-2.5 bottom-6 block lg:hidden">
          <MobileOrderSummarySkeleton />
        </div>
        <div className="w-full shrink-0 lg:pt-10">
          <div className="flex h-full w-full items-center justify-center">
            <div className="mx-auto w-full space-y-10 lg:max-w-[400px]">
              <div className="flex flex-col items-center gap-6">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="mx-auto h-4 w-6" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="mx-auto h-4 w-3/4" />
                <Skeleton className="mx-auto h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
        <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
          <OrderSummarySkeleton />
        </div>
      </div>
    </div>
  );
}
