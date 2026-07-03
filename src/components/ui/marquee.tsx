import { cn } from "@/lib/utils";

// Seamless horizontal marquee: the track holds two identical copies of `children`
// and translates by -50% (exactly one copy width) on an infinite linear loop, so
// at the wrap point the second copy sits where the first began — no visible jump.
// `speed` is read as seconds per cycle (higher = slower; default 20s, clamped
// 5–120). Honours prefers-reduced-motion: the track sits static, showing the copy.
export function Marquee({
  children,
  speed,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const duration = speed && speed > 0 ? Math.min(Math.max(speed, 5), 120) : 20;
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee motion-reduce:animate-none"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
