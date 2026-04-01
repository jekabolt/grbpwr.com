import { Skeleton } from "@/components/ui/skeleton";

const RATING_STEP_OPTION_COUNTS = [5, 4, 5] as const;

function FormStepSkeleton({ optionCount }: { optionCount: number }) {
  return (
    <div className="space-y-4 bg-bgColor text-textColor lg:space-y-8">
      <div className="flex flex-1 items-center gap-x-6">
        <Skeleton className="h-5 w-10 shrink-0" />
        <Skeleton className="h-5 w-full max-w-[14rem]" />
      </div>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: optionCount }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 min-w-[6rem] flex-1 basis-[45%] sm:basis-auto sm:flex-initial"
          />
        ))}
      </div>
    </div>
  );
}

function ProductRowSkeleton() {
  return (
    <div className="space-y-6 border-b border-textInactiveColor py-6 first:pt-0 last:border-b-0">
      <div className="flex items-stretch gap-x-3">
        <Skeleton className="h-[112px] w-[90px] shrink-0 self-start sm:h-[120px]" />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          <Skeleton className="h-5 w-full max-w-[240px]" />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 min-w-[4rem] flex-1 basis-[30%] sm:flex-initial" />
        ))}
      </div>
    </div>
  );
}

export function OrderReviewPanelSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-10 lg:flex-row lg:gap-52">
        <div className="w-full space-y-10">
          <div className="flex items-center justify-between gap-y-6 border-b border-textInactiveColor pb-6">
            <div className="flex w-full flex-col items-baseline justify-between gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-full max-w-[200px]" />
            </div>
            <div className="flex w-full flex-col items-baseline justify-between gap-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          {RATING_STEP_OPTION_COUNTS.map((n, i) => (
            <FormStepSkeleton key={i} optionCount={n} />
          ))}
        </div>
        <div className="w-full space-y-10">
          <div className="space-y-4 bg-bgColor text-textColor lg:space-y-8">
            <div className="flex flex-1 items-center gap-x-6">
              <Skeleton className="h-5 w-10 shrink-0" />
              <Skeleton className="h-5 w-full max-w-[10rem]" />
            </div>
            <div className="block lg:hidden">
              <div className="space-y-0 border border-textInactiveColor p-2.5">
                <Skeleton className="h-6 w-full max-w-[280px]" />
                <div className="mt-6 w-full space-y-0">
                  <ProductRowSkeleton />
                </div>
              </div>
            </div>
            <div className="hidden max-h-[50vh] w-full space-y-3 overflow-y-auto lg:block">
              <ProductRowSkeleton />
              <ProductRowSkeleton />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="max-h-32 min-h-32 w-full" />
            <Skeleton className="fixed inset-x-2.5 bottom-2.5 z-50 h-12 w-full lg:static" />
          </div>
        </div>
      </div>
    </div>
  );
}
