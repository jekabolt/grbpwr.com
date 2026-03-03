import { Skeleton } from "@/components/ui/skeleton";

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
        </div>
        <div className="space-y-10 lg:space-y-16">
          <FieldsGroupSkeleton titleWidth="5rem" fieldCount={3} />
          <FieldsGroupSkeleton titleWidth="4rem" fieldCount={5} />
          <FieldsGroupSkeleton titleWidth="7rem" fieldCount={4} />
        </div>
        <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
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
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
