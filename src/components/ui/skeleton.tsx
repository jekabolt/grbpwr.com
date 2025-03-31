import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-textInactiveColor opacity-10",
        className,
      )}
      {...props}
    />
  );
}
