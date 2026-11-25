"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AddressesSectionFallback({
  defaultOnly = false,
  rows = 3,
}: {
  defaultOnly?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className={cn("space-y-3 border-b border-textInactiveColor py-6", {
            "border-transparent pb-0": defaultOnly,
          })}
        >
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function OrderReturnsSectionFallback() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="space-y-2 border-b border-textInactiveColor py-6"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}
