import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function MobileCollapsedOrderSummarySkeleton() {
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
          <Skeleton className="h-[90px] min-w-[72px] shrink-0" />
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-[85%] max-w-[200px]" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="ml-auto h-3.5 w-14 shrink-0" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3 pt-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="border-t border-textInactiveColor pt-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutStepHeaderSkeleton({
  subtitle,
  subdued = false,
}: {
  subtitle?: "contact" | "shipping" | "payment";
  subdued?: boolean;
}) {
  const titleClass =
    subtitle === "shipping"
      ? "h-4 max-w-[min(100%,320px)] flex-1"
      : subtitle === "payment"
        ? "h-4 max-w-[min(100%,200px)] flex-1"
        : "h-4 max-w-[min(100%,120px)] flex-1";

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        subdued ? "opacity-40" : null,
      )}
    >
      <div className="flex min-h-12 flex-1 items-center gap-x-6 lg:h-20">
        <Skeleton className="h-4 w-8 shrink-0" />
        <Skeleton className={cn(titleClass)} />
      </div>
      <Skeleton className="h-4 w-4 shrink-0" />
    </div>
  );
}

function ShippingMethodCardSkeleton() {
  return (
    <div className="flex min-h-[104px] flex-col justify-between gap-3 border border-textInactiveColor p-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full" />
        <Skeleton className="h-3.5 w-14 shrink-0" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-[70%] max-w-[140px]" />
      </div>
    </div>
  );
}

function SignedInCheckoutStepsSkeleton() {
  return (
    <div className="space-y-10 lg:space-y-16">
      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="contact" />
        <div className="space-y-4 lg:ml-14">
          <Skeleton className="h-4 w-full max-w-[min(100%,280px)]" />
        </div>
      </div>

      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="shipping" />
        <div className="space-y-8 lg:ml-14">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <div className="flex justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-full max-w-[260px]" />
                <Skeleton className="h-3.5 w-full max-w-[220px]" />
                <Skeleton className="h-3.5 w-full max-w-[200px]" />
                <Skeleton className="h-3.5 w-full max-w-[180px]" />
                <Skeleton className="h-3.5 w-full max-w-[160px]" />
              </div>
              <Skeleton className="h-3.5 w-10 shrink-0 self-start" />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ShippingMethodCardSkeleton />
              <ShippingMethodCardSkeleton />
              <ShippingMethodCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="payment" subdued />
      </div>
    </div>
  );
}

function GuestCheckoutStepsSkeleton() {
  return (
    <div className="space-y-10 lg:space-y-16">
      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="contact" />
        <div className="space-y-4 lg:ml-14">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-3.5 w-48 max-w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="shipping" />
        <div className="space-y-4 lg:ml-14">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-3 w-40" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ShippingMethodCardSkeleton />
              <ShippingMethodCardSkeleton />
              <ShippingMethodCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-8">
        <CheckoutStepHeaderSkeleton subtitle="payment" />
        <div className="space-y-4 lg:ml-14">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-[4.5rem]" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopOrderSummarySkeleton() {
  return (
    <div className="hidden space-y-8 lg:block">
      <Skeleton className="h-4 w-36" />
      <div className="flex max-h-[50vh] flex-col gap-4">
        <div className="flex gap-4">
          <Skeleton className="h-[120px] w-[72px] shrink-0" />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-12" />
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
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
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="pt-5">
            <div className="flex items-center justify-between border-t border-textInactiveColor pt-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutTwoColumnShell({
  mobileSummary,
  leftColumn,
  showPlaceOrderPlaceholder,
}: {
  mobileSummary: ReactNode;
  leftColumn: ReactNode;
  showPlaceOrderPlaceholder: boolean;
}) {
  return (
    <div className="relative space-y-14 lg:space-y-0">
      <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-28">
        <div className="block lg:hidden">{mobileSummary}</div>
        {leftColumn}
        <div className="fixed inset-x-2.5 bottom-3 lg:sticky lg:top-16 lg:space-y-8 lg:self-start">
          <DesktopOrderSummarySkeleton />
          {showPlaceOrderPlaceholder ? (
            <Skeleton className="h-12 w-full" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Placeholder shell matching checkout `AccountLoginForm` layout + sidebar order summary. */
export function CheckoutLoginFormSkeleton() {
  return (
    <div className="relative h-full space-y-14 lg:space-y-0">
      <div className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center gap-14 lg:grid lg:min-h-0 lg:grid-cols-2 lg:justify-start lg:gap-28">
        <div className="fixed inset-x-2.5 bottom-6 block lg:hidden">
          <MobileCollapsedOrderSummarySkeleton />
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
          <DesktopOrderSummarySkeleton />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSignedInSkeleton() {
  return (
    <CheckoutTwoColumnShell
      mobileSummary={<MobileExpandedOrderSummarySkeleton />}
      leftColumn={<SignedInCheckoutStepsSkeleton />}
      showPlaceOrderPlaceholder
    />
  );
}

export function CheckoutGuestSkeleton() {
  return (
    <CheckoutTwoColumnShell
      mobileSummary={<MobileExpandedOrderSummarySkeleton />}
      leftColumn={<GuestCheckoutStepsSkeleton />}
      showPlaceOrderPlaceholder
    />
  );
}
