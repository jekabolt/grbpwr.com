import { Skeleton } from "./skeleton";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
