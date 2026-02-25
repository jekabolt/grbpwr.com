import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutFormSkeleton() {
  return (
    <div className="relative space-y-14 px-2.5 py-20 lg:space-y-0 lg:px-32 lg:py-24">
      <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
        <div className="space-y-10 lg:space-y-16">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
          <div className="hidden space-y-8 lg:block">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full max-w-[160px]" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
