import { cn } from "@/lib/utils";

export function Banner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 border border-textInactiveColor bg-bgColor text-textColor lg:bottom-2 lg:left-auto lg:top-auto lg:w-96",
        className,
      )}
    >
      {children}
    </div>
  );
}
