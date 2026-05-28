import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileCollapsedOrderSummarySkeleton } from "@/app/[locale]/(checkout)/checkout/_components/checkout-skeleton";

const LOGIN_FORM_WIDTH_CLASS = "w-full max-w-md";

export function LoginEmailStepSkeleton() {
  return (
    <div className={cn("w-full space-y-6", LOGIN_FORM_WIDTH_CLASS)} aria-hidden>
      <div className="w-full space-y-10 lg:border lg:border-textInactiveColor lg:p-10">
        <div className="flex w-full flex-col items-center gap-6">
          <Skeleton className="h-4 w-36 max-w-full" />
          <Skeleton className="h-4 w-40 max-w-full" />
        </div>
        <div className="w-full space-y-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="w-full space-y-2">
        <Skeleton className="mx-auto h-4 w-full max-w-[85%]" />
        <Skeleton className="mx-auto h-4 w-full max-w-[55%]" />
      </div>
    </div>
  );
}

export function AccountDesktopOrderSummarySkeleton() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col space-y-8" aria-hidden>
      <Skeleton className="h-4 w-36" />
      <div className="mt-auto space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between border-t border-textInactiveColor pt-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex max-h-[50vh] flex-col gap-4">
        {Array.from({ length: 4 }).map((_, id) => (
          <div key={id} className="flex gap-4">
            <Skeleton className="h-[160px] w-[72px] shrink-0" />
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-full max-w-[200px]" />
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              <Skeleton className="h-4 w-16 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountMobileOrderSummarySkeleton() {
  return (
    <div className="w-full" aria-hidden>
      <MobileCollapsedOrderSummarySkeleton />
    </div>
  );
}
