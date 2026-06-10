import { cn } from "@/lib/utils";

export function Skeleton({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "highlight";
}) {
  return (
    <div
      className={cn(
        "animate-[pulse_2s_cubic-bezier(0,0,0.2,1)_infinite]",
        {
          "bg-highlightColor": variant === "highlight",
          "bg-textInactiveColor": variant === "default",
        },
        className,
      )}
      {...props}
    />
  );
}
